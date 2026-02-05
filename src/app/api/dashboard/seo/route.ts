import { NextRequest, NextResponse } from 'next/server';
import { SEOService } from '@/lib/services/seo-service';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const storeId = searchParams.get('storeId');

        if (!storeId) {
            return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
        }

        // Get latest SEO audit
        const history = await SEOService.getSEOHistory(storeId, 1);

        if (history.length === 0) {
            // Return mock data for demonstration
            return NextResponse.json({
                overallScore: 72,
                seoScore: 68,
                performanceScore: 85,
                accessibilityScore: 78,
                bestPracticesScore: 82,
                issues: [
                    { type: 'warning', message: 'Meta description is too short' },
                    { type: 'info', message: 'Consider adding more internal links' },
                    { type: 'warning', message: 'Missing OG image' },
                ],
                recommendations: [
                    'Add a compelling meta description between 150-160 characters',
                    'Include relevant images with alt text',
                    'Add structured data markup for better rich snippets',
                ],
            });
        }

        const latestAudit = history[0];
        return NextResponse.json({
            overallScore: latestAudit.overall_score,
            seoScore: latestAudit.seo_score,
            performanceScore: latestAudit.performance_score,
            accessibilityScore: latestAudit.accessibility_score,
            bestPracticesScore: latestAudit.best_practices_score,
            issues: latestAudit.issues || [],
            recommendations: latestAudit.recommendations || [],
        });
    } catch (error) {
        console.error('Dashboard SEO API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { storeId } = await req.json();

        if (!storeId) {
            return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
        }

        const result = await SEOService.analyzeStore(storeId);

        return NextResponse.json(result);
    } catch (error) {
        console.error('SEO analysis API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
