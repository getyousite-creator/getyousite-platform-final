/**
 * GetYouSite Core API - AI Engine v1.0
 * 
 * Sovereign site generation endpoint with Chain-of-Thought prompting
 * Implements the full Sovereign Blueprint protocol
 */

import { NextRequest, NextResponse } from "next/server";
import {
    GetYouSiteEngine,
    generateSiteWithCoT,
    type GeneratedCode,
} from "@/lib/ai/getyousite-core";
import { partialUpdate } from "@/lib/ai/partial-hydration";
import { generateMarketingContent } from "@/lib/ai/marketing-content";

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

interface GenerateSiteRequest {
    /** User's site description prompt */
    prompt: string;
    
    /** Target locale (ar|en) */
    locale?: string;
    
    /** Optional: Business name */
    businessName?: string;
    
    /** Optional: Business niche */
    niche?: string;
    
    /** Optional: Business vision */
    vision?: string;
}

interface GenerateSiteResponse {
    success: boolean;
    data?: GeneratedCode;
    error?: string;
}

interface PartialUpdateRequest {
    /** Existing blueprint to modify */
    blueprint: any;
    
    /** Modification command */
    command: string;
    
    /** Optional: Target section ID */
    targetSectionId?: string;
    
    /** Optional: Locale */
    locale?: string;
}

interface ContentGenerateRequest {
    businessName: string;
    niche: string;
    vision: string;
    locale: string;
    sectionType: string;
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...payload } = body;

        switch (action) {
            case "generate":
                return handleGenerateSite(payload as GenerateSiteRequest);
            
            case "update":
                return handlePartialUpdate(payload as PartialUpdateRequest);
            
            case "content":
                return handleGenerateContent(payload as ContentGenerateRequest);
            
            default:
                return NextResponse.json(
                    {
                        success: false,
                        error: `Unknown action: ${action}. Valid actions: generate, update, content`,
                    },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("[GetYouSite Core API] Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

/**
 * Handle site generation with Chain-of-Thought
 */
async function handleGenerateSite(payload: GenerateSiteRequest): Promise<NextResponse> {
    const { prompt, locale = "ar", businessName, niche, vision } = payload;

    if (!prompt) {
        return NextResponse.json(
            { success: false, error: "Prompt is required" },
            { status: 400 }
        );
    }

    console.log("[GetYouSite Core API] Generating site for prompt:", prompt);

    // Initialize engine with Gemini 3 Flash
    const engine = new GetYouSiteEngine({
        model: process.env.GEMINI_MODEL || "gemini-3-flash",
        cachedContent: process.env.GEMINI_CACHED_CONTENT,
    });

    // Execute full generation pipeline
    const result = await engine.generateSite(prompt, locale);

    return NextResponse.json({
        success: true,
        data: result,
    });
}

/**
 * Handle partial blueprint update
 */
async function handlePartialUpdate(payload: PartialUpdateRequest): Promise<NextResponse> {
    const { blueprint, command, targetSectionId, locale = "ar" } = payload;

    if (!blueprint || !command) {
        return NextResponse.json(
            {
                success: false,
                error: "Blueprint and command are required",
            },
            { status: 400 }
        );
    }

    console.log("[GetYouSite Core API] Partial update for command:", command);

    const result = await partialUpdate(blueprint, command, {
        targetSectionId,
        locale,
    });

    return NextResponse.json({
        success: true,
        data: result,
    });
}

/**
 * Handle marketing content generation
 */
async function handleGenerateContent(payload: ContentGenerateRequest): Promise<NextResponse> {
    const { businessName, niche, vision, locale, sectionType } = payload;

    if (!businessName || !niche || !sectionType) {
        return NextResponse.json(
            {
                success: false,
                error: "Business name, niche, and section type are required",
            },
            { status: 400 }
        );
    }

    console.log("[GetYouSite Core API] Generating content for section:", sectionType);

    const content = await generateMarketingContent({
        businessName,
        niche,
        vision,
        locale,
        sectionType,
    });

    return NextResponse.json({
        success: true,
        data: content,
    });
}

// ============================================================================
// GET HANDLER - API Info
// ============================================================================

export async function GET() {
    return NextResponse.json({
        name: "GetYouSite Core API",
        version: "1.0",
        description: "Sovereign AI Engine with Chain-of-Thought Prompting",
        endpoints: {
            generate: {
                method: "POST",
                action: "generate",
                description: "Generate complete site with CoT prompting",
                payload: {
                    prompt: "string (required)",
                    locale: "string (ar|en, default: ar)",
                    businessName: "string (optional)",
                    niche: "string (optional)",
                    vision: "string (optional)",
                },
            },
            update: {
                method: "POST",
                action: "update",
                description: "Partial blueprint update (surgical modification)",
                payload: {
                    blueprint: "object (required)",
                    command: "string (required)",
                    targetSectionId: "string (optional)",
                    locale: "string (ar|en, default: ar)",
                },
            },
            content: {
                method: "POST",
                action: "content",
                description: "Generate marketing content for a section",
                payload: {
                    businessName: "string (required)",
                    niche: "string (required)",
                    vision: "string (required)",
                    locale: "string (ar|en)",
                    sectionType: "string (required)",
                },
            },
        },
        features: [
            "Chain-of-Thought Prompting (3 phases)",
            "Automated QA Protocol (4 checks)",
            "Partial Hydration Updates",
            "RTL/Arabic Support",
            "AIDA Marketing Copy",
            "No Lorem Ipsum Guarantee",
        ],
    });
}
