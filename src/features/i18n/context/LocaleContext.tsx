"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocale } from 'next-intl';

interface LocaleContextType {
    locale: string;
    isRTL: boolean;
    direction: 'rtl' | 'ltr';
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const direction = isRTL ? 'rtl' : 'ltr';

    return (
        <LocaleContext.Provider value={{ locale, isRTL, direction }}>
            <div dir={direction} className="contents">
                {children}
            </div>
        </LocaleContext.Provider>
    );
}

export function useSovereignLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useSovereignLocale must be used within a LocaleProvider');
    }
    return context;
}
