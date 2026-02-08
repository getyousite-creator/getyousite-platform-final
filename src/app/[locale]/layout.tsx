import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "@/app/globals.css";
// import { Inter, Noto_Sans_Arabic } from "next/font/google";
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

// LOGIC UPDATE: Use system fonts to prevent build blocking on external fetch
const inter = { variable: "--font-inter" };
const notoArabic = { variable: "--font-noto-arabic" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        title: t('title'),
        description: t('description'),
        manifest: '/manifest.json',
        themeColor: '#ffffff',
        openGraph: {
            title: t('title'),
            description: t('description'),
            type: 'website',
            locale: locale,
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
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

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="scroll-smooth">
            <body className={cn(
                locale === 'ar' ? notoArabic.variable : inter.variable,
                "bg-background text-foreground antialiased font-sans transition-colors duration-500"
            )}>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem={false}
                        disableTransitionOnChange
                        themes={["light", "dark", "medical", "luxury"]}
                    >
                        <SupabaseProvider>
                            <PwaProvider>
                                <AnalyticsProvider>
                                    <JsonLd />
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
