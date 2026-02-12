import { SEOAutomationService } from "@/lib/services/seo-automation-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ hostname: string }> }
) {
    const { hostname } = await params;

    const txt = SEOAutomationService.generateRobots(hostname);

    return new NextResponse(txt, {
        headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
