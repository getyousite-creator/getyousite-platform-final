import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "@/app/globals.css";
import { Inter, Tajawal } from "next/font/google";
import { cn } from "@/lib/utils";
import JsonLd from "@/components/seo/JsonLd";
import LaunchModal from "@/components/forms/LaunchModal";
import AuthModalManager from "@/components/auth/AuthModalManager";
import FloatingChat from "@/components/chat/FloatingChat";
import { Toaster } from "@/shared/components/ui/sonner";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { PwaProvider } from "@/components/providers/PwaProvider";
import { LocaleProvider } from "@/features/i18n/context/LocaleContext";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const ibmPlexArabic = Tajawal({
    subsets: ["arabic"],
    weight: ["200", "300", "400", "500", "700", "800", "900"],
    variable: "--font-arabic",
    display: "swap",
});


export const dynamicParams = true;

export const viewport = {
    themeColor: '#ffffff',
};


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('title'),
        description: t('description'),
        manifest: '/manifest.json',
        alternates: {
            canonical: `https://gysglobal.com/${locale}`,
            languages: {
                'en': 'https://gysglobal.com/en',
                'ar': 'https://gysglobal.com/ar',
                'fr': 'https://gysglobal.com/fr',
                'es': 'https://gysglobal.com/es',
                'de': 'https://gysglobal.com/de',
                'it': 'https://gysglobal.com/it',
                'ru': 'https://gysglobal.com/ru',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            locale: locale,
            url: `https://gysglobal.com/${locale}`,
            siteName: 'GYS Global',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
            site: '@gysglobal',
        }
    };
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
        notFound();
    }

    const messages = await getMessages();
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return (
        <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="scroll-smooth" suppressHydrationWarning>
            <body className={cn(
                inter.variable,
                ibmPlexArabic.variable,
                "bg-background text-foreground antialiased transition-colors duration-500 min-h-screen"
            )}>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        disableTransitionOnChange
                        themes={["light", "dark", "medical", "luxury", "sovereign"]}
                    >
                        <LocaleProvider>
                            <SupabaseProvider>
                                <PwaProvider>
                                    <AnalyticsProvider>
                                        <JsonLd
                                            name={t('title')}
                                            description={t('description')}
                                            url="https://gysglobal.com"
                                            logo="https://gysglobal.com/logo.png"
                                            locale={locale}
                                        />
                                        <Suspense fallback={null}>
                                            <LaunchModal />
                                            <AuthModalManager />
                                            {children}
                                            <FloatingChat />
                                        </Suspense>
                                        <Toaster />
                                    </AnalyticsProvider>
                                </PwaProvider>
                            </SupabaseProvider>
                        </LocaleProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
