import { NextRequest, NextResponse } from 'next/server';
import { StoreService } from '@/lib/services/store-service';
import { AuthService } from '@/lib/services/auth-service';

export async function GET(req: NextRequest) {
    try {
        // Verify authentication
        const user = await AuthService.getCurrentUser();
        if (!user.data) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user stores
        const { data: stores, error } = await StoreService.getUserStores();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ stores });
    } catch (error) {
        console.error('Dashboard stores API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
