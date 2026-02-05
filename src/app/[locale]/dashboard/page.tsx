
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { AuthService } from '@/lib/services/auth-service';

export default async function DashboardPage({ params }: { params: { locale: string } }) {
    // 1. Verify Auth & Get User
    const user = await AuthService.getCurrentUser();
    if (!user.data) {
        redirect(`/${params.locale}/login`);
    }

    // 2. Translations (stub for now, assuming keys exist or fallback)
    const t = await getTranslations('Dashboard');

    return <DashboardClient />;
}
