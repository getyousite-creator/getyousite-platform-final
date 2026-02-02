export type CurrencyLocale = 'USD' | 'EUR' | 'CHF' | 'AED' | 'GBP' | 'JPY';
export type UnitSystem = 'imperial' | 'metric';

interface FormattingOptions {
    currency: CurrencyLocale;
    units: UnitSystem;
}

export const MarketIntelligenceBridge = {
    /**
     * Formats a price based on the target market currency.
     * Note: In a production environment, this would fetch live rates.
     */
    formatPrice: (amount: number, currency: CurrencyLocale = 'USD') => {
        const rates: Record<CurrencyLocale, number> = {
            USD: 1,
            EUR: 0.92,
            CHF: 0.86,
            AED: 3.67,
            GBP: 0.79,
            JPY: 148.5
        };

        const converted = amount * rates[currency];

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(converted);
    },

    /**
     * Formats area based on unit system (Sq Ft vs Sq M).
     */
    formatArea: (sqFt: number, system: UnitSystem = 'imperial') => {
        if (system === 'metric') {
            const sqM = sqFt * 0.092903;
            return `${Math.round(sqM).toLocaleString()} Sq M`;
        }
        return `${sqFt.toLocaleString()} Sq Ft`;
    },

    /**
     * Determines default formatting based on locale string.
     */
    getDefaults: (locale: string): FormattingOptions => {
        switch (locale) {
            case 'ar':
                return { currency: 'AED', units: 'metric' };
            case 'es':
            case 'fr':
                return { currency: 'EUR', units: 'metric' };
            default:
                return { currency: 'USD', units: 'imperial' };
        }
    }
};
