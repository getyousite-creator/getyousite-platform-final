import { NextRequest, NextResponse } from "next/server";
import { generateCompleteWebsite } from "@/lib/ai/multi-provider";
import { z } from "zod";

// Strict Input Validation
const GenerateRequestSchema = z.object({
  businessName: z.string().min(2),
  niche: z.string().min(2),
  vision: z.string().min(10),
  locale: z.string().length(2).default("en"),
  features: z.array(z.string()).optional(),
});

export const maxDuration = 60; // Allow 60 seconds for AI generation

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validation Logic
    const validation = GenerateRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "INVALID_INPUT", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { businessName, niche, vision, locale, features } = validation.data;

    // 2. Sovereign AI Execution
    console.log(`[API/Generate] Initiating Sovereign Protocol for: ${businessName}`);

    const blueprint = await generateCompleteWebsite({
      businessName,
      niche,
      vision,
      locale,
      features,
    });

    // 3. CREDIT_ACCOUNTABILITY_PROTOCOL
    const user = await AuthService.getCurrentUser();
    if (user.data?.id) {
      await AuthService.consumeCredit(user.data.id);
      console.log(`[SOVEREIGN_WALLET] 1 Credit consumed for User: ${user.data.id}`);
    }

    // 3. Response Synthesis
    return NextResponse.json({
      success: true,
      data: blueprint,
      meta: {
        engine: "Sovereign-v3",
        latency: "Optimized",
      }
    });

  } catch (error: unknown) {
    console.error("[API/Generate] Critical Failure:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Strict Error Mapping
    if (errorMessage === "AUTH_REQUIRED_FOR_AI") {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Sovereign Access Required. Please Authenticate." },
        { status: 401 }
      );
    }

    if (errorMessage.includes("INSUFFICIENT_CREDITS")) {
      return NextResponse.json(
        { error: "PAYMENT_REQUIRED", message: "Credit Logic Depleted. Top-up Required." },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Sovereign Logic Synthesis Failed." },
      { status: 500 }
    );
  }
}
