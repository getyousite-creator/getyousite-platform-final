import { NextRequest, NextResponse } from "next/server";
import { deployToVercel, exportSourceCode, startHealthMonitoring } from "@/lib/deploy/quantum-deploy";
import { setupDomain, verifyDomain } from "@/lib/deploy/cloudflare-dns";
import { SiteBlueprint } from "@/lib/schemas";



interface DeployRequest {
    siteId: string;
    blueprint: SiteBlueprint;
    customDomain?: string;
    environment?: "production" | "preview";
    exportSource?: boolean;
}

interface DeployResponse {
    success: boolean;
    deploymentId?: string;
    url?: string;
    customDomainUrl?: string;
    sourceCodeUrl?: string;
    buildTime?: number;
    error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<DeployResponse | { success: boolean, error: string }>> {
    try {
        const body: DeployRequest = await request.json();
        if (!body.siteId || !body.blueprint) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: siteId or blueprint" },
                { status: 400 }
            );
        }

        const deployment = await deployToVercel({
            siteId: body.siteId,
            blueprint: body.blueprint,
            customDomain: body.customDomain,
            environment: body.environment || "production",
        });

        if (!deployment.success) {
            return NextResponse.json({ success: false, error: "Deployment failed" }, { status: 500 });
        }

        let customDomainUrl: string | undefined;
        if (body.customDomain) {
            const domainSetup = await setupDomain({
                domain: body.customDomain,
                siteId: body.siteId,
                targetUrl: deployment.url,
            });
            if (domainSetup.success) {
                customDomainUrl = `https://${body.customDomain}`;
            }
        }

        let sourceCodeUrl: string | undefined;
        if (body.exportSource) {
            const exportResult = await exportSourceCode(body.blueprint, body.siteId);
            sourceCodeUrl = exportResult.zipUrl;
        }

        startHealthMonitoring(body.siteId, deployment.url);

        return NextResponse.json({
            success: true,
            deploymentId: deployment.deploymentId,
            url: deployment.url,
            customDomainUrl,
            sourceCodeUrl,
            buildTime: deployment.buildTime,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const domain = request.nextUrl.searchParams.get("domain");
    if (!domain) return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });

    try {
        const verification = await verifyDomain(domain);
        return NextResponse.json({ domain, ...verification });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Verification failed" },
            { status: 500 }
        );
    }
}
