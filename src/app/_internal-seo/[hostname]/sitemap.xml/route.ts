import { SEOAutomationService } from "@/lib/services/seo-automation-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ hostname: string }> }
) {
    const { hostname } = await params;

    // Logic: Absolute truth retrieval for this node
    const xml = await SEOAutomationService.generateSitemap(hostname);

    if (!xml) {
        return new NextResponse("Not Found", { status: 404 });
    }

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
