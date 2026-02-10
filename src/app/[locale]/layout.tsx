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
