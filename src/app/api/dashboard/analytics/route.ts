import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/services/analytics-service';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const storeId = searchParams.get('storeId');
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        if (!storeId) {
            return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
        }

        const startDate = startDateParam
            ? new Date(startDateParam)
            : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = endDateParam
            ? new Date(endDateParam)
            : new Date();

        const summary = await AnalyticsService.getAnalyticsSummary(storeId, startDate, endDate);

        return NextResponse.json(summary);
    } catch (error) {
        console.error('Dashboard analytics API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { storeId, path, metadata } = body;

        // Security Gate: Validate Store Existence & Format
        if (!storeId || typeof storeId !== 'string' || storeId.length < 20) {
            return NextResponse.json({ error: 'INVALID_STORE_IDENTITY' }, { status: 400 });
        }

        // Logic Gate: Payload Sanity
        if (path && path.length > 2000) {
            return NextResponse.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
        }

        // Potential Optimization: Cache store existence or use a fire-and-forget logic 
        // with internal DB validation. For now, we call the service which uses RLS 
        // or direct check. Note: trackPageView is public-facing.

        await AnalyticsService.trackPageView(storeId, path || '/', metadata || {});

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics ingestion security_alert:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
