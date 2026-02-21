/**
 * Deployment API - POST /api/deploy
 * 
 * Handles site deployment with:
 * - Blueprint to Next.js conversion
 * - Vercel Edge deployment
 * - Custom domain setup (Cloudflare)
 * - Health monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { deployToVercel, exportSourceCode, startHealthMonitoring } from '@/lib/deploy/quantum-deploy';
import { setupDomain, verifyDomain } from '@/lib/deploy/cloudflare-dns';
import { SiteBlueprint } from '@/lib/schemas';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface DeployRequest {
    siteId: string;
    blueprint: SiteBlueprint;
    customDomain?: string;
    environment?: 'production' | 'preview';
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

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<DeployResponse>> {
    try {
        const body: DeployRequest = await request.json();

        // Validate request
        if (!body.siteId || !body.blueprint) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: siteId, blueprint' },
                { status: 400 }
            );
        }

        console.log(`[QDP API] Starting deployment for site ${body.siteId}...`);

        // Step 1: Deploy to Vercel
        console.log('[QDP API] Deploying to Vercel...');
        const deployment = await deployToVercel({
            siteId: body.siteId,
            blueprint: body.blueprint,
            customDomain: body.customDomain,
            environment: body.environment || 'production',
        });

        if (!deployment.success) {
            return NextResponse.json(
                { success: false, error: 'Deployment failed' },
                { status: 500 }
            );
        }

        // Step 2: Setup custom domain if provided
        let customDomainUrl: string | undefined;
        if (body.customDomain) {
            console.log(`[QDP API] Setting up custom domain: ${body.customDomain}...`);
            const domainSetup = await setupDomain({
                domain: body.customDomain,
                siteId: body.siteId,
                targetUrl: deployment.url,
            });

            if (domainSetup.success) {
                customDomainUrl = `https://${body.customDomain}`;
            }
        }

        // Step 3: Export source code if requested
        let sourceCodeUrl: string | undefined;
        if (body.exportSource) {
            console.log('[QDP API] Exporting source code...');
            const exportResult = await exportSourceCode(body.blueprint, body.siteId);
            sourceCodeUrl = exportResult.zipUrl;
        }

        // Step 4: Start health monitoring
        console.log('[QDP API] Starting health monitoring...');
        startHealthMonitoring(body.siteId, deployment.url);

        console.log(`[QDP API] Deployment complete in ${deployment.buildTime}ms`);

        return NextResponse.json({
            success: true,
            deploymentId: deployment.deploymentId,
            url: deployment.url,
            customDomainUrl,
            sourceCodeUrl,
            buildTime: deployment.buildTime,
        });
    } catch (error) {
        console.error('[QDP API] Deployment error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
}

// ============================================================================
// DOMAIN VERIFICATION ENDPOINT
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json(
            { error: 'Missing domain parameter' },
            { status: 400 }
        );
    }

    try {
        const verification = await verifyDomain(domain);

        return NextResponse.json({
            domain,
            ...verification,
        });
    } catch (error) {
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Verification failed' 
            },
            { status: 500 }
        );
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const runtime = 'nodejs'; // Run on Edge for faster response

