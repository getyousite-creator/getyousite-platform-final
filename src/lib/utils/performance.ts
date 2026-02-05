/**
 * Performance Optimization Utilities
 * 
 * Tools for optimizing application performance including:
 * - Image optimization
 * - Code splitting
 * - Caching strategies
 * - Bundle size optimization
 */

// Image optimization utilities
export interface ImageOptimizationOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export function optimizeImageUrl(
    url: string,
    options: ImageOptimizationOptions = {}
): string {
    // If using Next.js Image Optimization, this would integrate with that
    // For external URLs, this would typically use a service like Cloudinary, imgix, etc.
    const params = new URLSearchParams();

    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('fm', options.format);

    const queryString = params.toString();
    return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
}

// Memoization utilities for expensive computations
export function memoize<T extends (...args: any[]) => any>(
    fn: T,
    maxSize: number = 100
): T {
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>) => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);
        cache.set(key, result);

        // Limit cache size
        if (cache.size > maxSize) {
            const firstKey = cache.keys().next().value as string;
            cache.delete(firstKey);
        }

        return result;
    }) as T;
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Batch processing utility
export async function batchProcess<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10
): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(processor));
        results.push(...batchResults);
    }

    return results;
}

// Resource hint utilities
export function generatePreconnectHints(domains: string[]): string[] {
    return domains.map(domain =>
        `<link rel="preconnect" href="${domain}" crossorigin />`
    );
}

export function generateDnsPrefetchHints(domains: string[]): string[] {
    return domains.map(domain =>
        `<link rel="dns-prefetch" href="${domain}" />`
    );
}

export function generatePreloadHints(
    resources: { url: string; as: string; type?: string }[]
): string[] {
    return resources.map(resource => {
        let hint = `<link rel="preload" href="${resource.url}" as="${resource.as}"`;
        if (resource.type) {
            hint += ` type="${resource.type}"`;
        }
        hint += ' />';
        return hint;
    });
}

// Bundle analysis utilities
export interface BundleAnalysis {
    totalSize: number;
    chunks: { name: string; size: number }[];
    largestModules: { name: string; size: number }[];
    duplicatedModules: string[];
}

export function analyzeBundle(bundleStats: any): BundleAnalysis {
    // This would parse Webpack Bundle Analyzer output
    // For demo purposes, returning mock data
    return {
        totalSize: 0,
        chunks: [],
        largestModules: [],
        duplicatedModules: [],
    };
}

// Critical CSS extraction
export function extractCriticalCSS(html: string, css: string): string {
    // This would use a library like critical to extract CSS needed above the fold
    // For demo purposes, returning the full CSS
    return css;
}

// Performance monitoring utilities
export interface PerformanceMetrics {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
}

export function measureCoreWebVitals(): PerformanceMetrics {
    if (typeof window === 'undefined') {
        return { fcp: 0, lcp: 0, fid: 0, cls: 0, ttfb: 0 };
    }

    // These would be measured using Performance Observer API
    // For demo purposes, returning zeros
    return {
        fcp: 0,
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
    };
}

export function reportPerformanceMetrics(metrics: PerformanceMetrics): void {
    // Send metrics to analytics service
    console.log('Performance metrics:', metrics);
}

// Cache strategies
export enum CacheStrategy {
    NETWORK_FIRST = 'network-first',
    CACHE_FIRST = 'cache-first',
    STALE_WHILE_REVALIDATE = 'stale-while-revalidate',
    NETWORK_ONLY = 'network-only',
    CACHE_ONLY = 'cache-only',
}

export function getCacheKey(request: Request): string {
    const url = new URL(request.url);
    return `${url.pathname}${url.search}`;
}

// Service Worker utilities
export function registerServiceWorker(
    swUrl: string
): Promise<ServiceWorkerRegistration | undefined> {
    if ('serviceWorker' in navigator) {
        return navigator.serviceWorker.register(swUrl);
    }
    return Promise.resolve(undefined);
}

export function unregisterServiceWorkers(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
        return navigator.serviceWorker.getRegistrations().then(registrations => {
            return Promise.all(
                registrations.map(registration => registration.unregister())
            ).then(() => true);
        });
    }
    return Promise.resolve(false);
}
