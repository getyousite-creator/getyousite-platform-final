import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "@/app/globals.css";
// import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google"; // BYPASS_FONT_FETCH
import { cn } from "@/lib/utils";
import JsonLd from "@/components/seo/JsonLd";
import LaunchModal from "@/components/forms/LaunchModal";
import AuthModalManager from "@/components/auth/AuthModalManager";
import FloatingChat from "@/components/chat/FloatingChat";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { PwaProvider } from "@/components/providers/PwaProvider";

// MOCK FONTS FOR OFFLINE BUILD
const inter = { variable: "font-sans" };
const ibmPlexArabic = { variable: "font-arabic" };

/*
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
    subsets: ["arabic"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    variable: "--font-arabic",
    display: "swap",
});
*/

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('title'),
        description: t('description'),
        manifest: '/manifest.json',
        themeColor: '#ffffff',
        alternates: {
            canonical: `https://getyousite.com/${locale}`,
            languages: {
                'en': 'https://getyousite.com/en',
                'ar': 'https://getyousite.com/ar',
                'fr': 'https://getyousite.com/fr',
                'es': 'https://getyousite.com/es',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            locale: locale,
            url: `https://getyousite.com/${locale}`,
            siteName: 'GetYouSite',
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
            site: '@getyousite',
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
                        <SupabaseProvider>
                            <PwaProvider>
                                <AnalyticsProvider>
                                    <JsonLd
                                        name={t('title')}
                                        description={t('description')}
                                        url="https://getyousite.com"
                                        logo="https://getyousite.com/logo.png"
                                        locale={locale}
                                    />
                                    <LaunchModal />
                                    <AuthModalManager />
                                    {children}
                                    <FloatingChat />
                                    <Toaster />
                                </AnalyticsProvider>
                            </PwaProvider>
                        </SupabaseProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
