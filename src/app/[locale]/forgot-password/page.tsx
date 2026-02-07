"use client";

import AuthHub from '@/components/auth/AuthHub';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
    const t = useTranslations('Auth');

    return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none" />

            <div className="w-full relative z-10 flex flex-col items-center">
                <AuthHub initialMode="forgot-password" />

                <Link
                    href="/"
                    className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 hover:text-white transition-all flex items-center gap-2"
                >
                    <span className="opacity-50">←</span> {t('backHome')}
                </Link>
            </div>
        </div>
    );
}
