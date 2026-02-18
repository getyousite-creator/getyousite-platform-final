export interface ExperimentEventRow {
    variant: string;
    event_name: string;
    session_id: string | null;
}

export interface VariantMetrics {
    exposureSessions: Set<string>;
    publishClickSessions: Set<string>;
    signupSuccessSessions: Set<string>;
}

export interface DecisionResult {
    decision: string;
    reason: string;
    significant: boolean;
    enoughData: boolean;
    zScore: number;
    pValueApprox: number;
    liftPercent: number;
    minExposure: number;
}

export function zTestTwoProportions(
    successA: number,
    totalA: number,
    successB: number,
    totalB: number,
) {
    if (totalA === 0 || totalB === 0) return { z: 0, pValueApprox: 1 };

    const p1 = successA / totalA;
    const p2 = successB / totalB;
    const pPool = (successA + successB) / (totalA + totalB);
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / totalA + 1 / totalB));
    if (se === 0) return { z: 0, pValueApprox: 1 };

    const z = (p2 - p1) / se;
    const absZ = Math.abs(z);

    const t = 1 / (1 + 0.2316419 * absZ);
    const d = 0.3989423 * Math.exp((-absZ * absZ) / 2);
    const prob =
        d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + 1.330274 * t))));
    const pValueApprox = 2 * prob;

    return { z, pValueApprox };
}

export function aggregateByVariant(rows: ExperimentEventRow[]) {
    const metricsByVariant: Record<string, VariantMetrics> = {};

    for (const row of rows) {
        const variant = row.variant || "unknown";
        const sid = row.session_id || "";
        if (!sid) continue;

        if (!metricsByVariant[variant]) {
            metricsByVariant[variant] = {
                exposureSessions: new Set<string>(),
                publishClickSessions: new Set<string>(),
                signupSuccessSessions: new Set<string>(),
            };
        }

        if (row.event_name === "exp_playground_cta_v1_exposure") {
            metricsByVariant[variant].exposureSessions.add(sid);
        }
        if (row.event_name === "funnel_playground_publish_clicked") {
            metricsByVariant[variant].publishClickSessions.add(sid);
        }
        if (row.event_name === "funnel_signup_success") {
            metricsByVariant[variant].signupSuccessSessions.add(sid);
        }
    }

    return metricsByVariant;
}

export function toSerializableMetrics(metricsByVariant: Record<string, VariantMetrics>) {
    const out: Record<
        string,
        {
            exposure: number;
            publishClicks: number;
            signupSuccess: number;
            publishRate: number;
            signupRate: number;
        }
    > = {};

    for (const [variant, metrics] of Object.entries(metricsByVariant)) {
        const exposure = metrics.exposureSessions.size;
        const publishClicks = metrics.publishClickSessions.size;
        const signupSuccess = metrics.signupSuccessSessions.size;

        out[variant] = {
            exposure,
            publishClicks,
            signupSuccess,
            publishRate: exposure ? publishClicks / exposure : 0,
            signupRate: exposure ? signupSuccess / exposure : 0,
        };
    }

    return out;
}

export function decideExperiment(
    control: { exposure: number; signupSuccess: number },
    challenger: { exposure: number; signupSuccess: number },
    challengerName: string,
    minExposure = 100,
): DecisionResult {
    const cRate = control.exposure ? control.signupSuccess / control.exposure : 0;
    const tRate = challenger.exposure ? challenger.signupSuccess / challenger.exposure : 0;
    const lift = cRate > 0 ? ((tRate - cRate) / cRate) * 100 : 0;

    const { z, pValueApprox } = zTestTwoProportions(
        control.signupSuccess,
        control.exposure,
        challenger.signupSuccess,
        challenger.exposure,
    );

    const enoughData = control.exposure >= minExposure && challenger.exposure >= minExposure;
    const significant = pValueApprox < 0.05;

    if (!enoughData) {
        return {
            decision: "HOLD",
            reason: `Need >=${minExposure} exposure sessions per variant.`,
            significant,
            enoughData,
            zScore: z,
            pValueApprox,
            liftPercent: lift,
            minExposure,
        };
    }

    if (significant && tRate > cRate) {
        return {
            decision: `KEEP ${challengerName}`,
            reason: "Higher signup conversion with statistical significance.",
            significant,
            enoughData,
            zScore: z,
            pValueApprox,
            liftPercent: lift,
            minExposure,
        };
    }

    if (significant && cRate >= tRate) {
        return {
            decision: `KILL ${challengerName}`,
            reason: "No signup conversion advantage over control.",
            significant,
            enoughData,
            zScore: z,
            pValueApprox,
            liftPercent: lift,
            minExposure,
        };
    }

    return {
        decision: "HOLD",
        reason: "Difference is not statistically significant yet.",
        significant,
        enoughData,
        zScore: z,
        pValueApprox,
        liftPercent: lift,
        minExposure,
    };
}
