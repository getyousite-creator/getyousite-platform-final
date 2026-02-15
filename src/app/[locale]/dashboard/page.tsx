
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { AuthService } from '@/lib/services/auth-service';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // 1. Verify Auth & Get User
    const user = await AuthService.getCurrentUser();
    if (!user.data) {
        redirect(`/${locale}/login`);
    }

    await getTranslations('Dashboard');

    return <DashboardClient />;
}
