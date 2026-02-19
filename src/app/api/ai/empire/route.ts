import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateEmpirePlan } from "@/lib/ai/gemini-flash-agents";

const EmpireRequestSchema = z.object({
    businessDescription: z.string().min(8),
    locale: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = EmpireRequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "INVALID_INPUT", details: parsed.error.flatten() },
                { status: 400 },
            );
        }

        const plan = await generateEmpirePlan(parsed.data);
        return NextResponse.json({ success: true, data: plan });
    } catch (error) {
        console.error("EMPIRE_PLAN_FAILED:", error);
        return NextResponse.json(
            { error: "EMPIRE_PLAN_FAILED", message: "Unable to generate empire plan." },
            { status: 500 },
        );
    }
}
