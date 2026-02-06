import { NextRequest, NextResponse } from 'next/server';
import { exportSovereignAsset } from '@/lib/ai/multi-provider';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const storeId = searchParams.get('id');

        if (!storeId) {
            return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
        }

        const asset = await exportSovereignAsset(storeId);

        return NextResponse.json(asset);
    } catch (error) {
        console.error('EXPORT_API_ERROR', error);
        return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 });
    }
}
