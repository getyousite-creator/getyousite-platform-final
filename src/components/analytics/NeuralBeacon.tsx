"use client";

import { useEffect, useRef } from 'react';
import { trackVisitAction, trackHeartbeatAction, trackEventAction } from '@/app/actions/analytics-actions';
import { usePathname } from 'next/navigation';

interface NeuralBeaconProps {
    storeId: string;
}

/**
 * NEURAL BEACON (Sovereign Instrumentation)
 * Logic: Captures real human resonance, not just vanity impressions.
 * Monitors: Section visibility, scroll intent, and interaction friction.
 */
export function NeuralBeacon({ storeId }: NeuralBeaconProps) {
    const pathname = usePathname();
    const startTime = useRef<number>(Date.now());
    const scrollDepth = useRef<number>(0);
    const resonanceTracker = useRef<Record<string, number>>({});

    useEffect(() => {
        if (!storeId) return;

        // 1. PROTOCOL: INITIAL CONTACT
        const referrer = typeof document !== 'undefined' ? document.referrer : '';
        trackVisitAction(storeId, pathname, referrer).catch(() => { });

        // 2. PROTOCOL: NEURAL HEARTBEAT (Every 15s for exact session logic)
        const heartbeatInterval = setInterval(() => {
            trackHeartbeatAction(storeId).catch(() => { });
        }, 15000);

        // 3. PROTOCOL: RESONANCE MONITORING
        // We use IntersectionObserver to identify which sections the user is REALLY reading.
        const resonanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                    const sectionId = entry.target.id || entry.target.getAttribute('data-section') || 'unlabeled_logic';

                    // Logic: Track when resonance is established with a specific value proposition
                    trackEventAction(storeId, pathname, 'section_resonance', {
                        sectionId,
                        timestamp: new Date().toISOString()
                    }).catch(() => { });
                }
            });
        }, { threshold: 0.6 });

        // Target all semantic blocks
        document.querySelectorAll('section, header, footer, [data-section]').forEach(el =>
            resonanceObserver.observe(el)
        );

        // 4. PROTOCOL: SCROLL INTENT
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const depth = Math.round(((currentScroll + windowHeight) / docHeight) * 100);

            if (depth > scrollDepth.current) {
                scrollDepth.current = depth;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // 5. PROTOCOL: INTERACTION FRICTION (Track hesitation on CTAs)
        const handleInteraction = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.tagName === 'A') {
                trackEventAction(storeId, pathname, 'logic_interaction', {
                    element: target.innerText?.slice(0, 20) || 'unlabeled_cta',
                    type: 'click'
                }).catch(() => { });
            }
        };

        document.addEventListener('click', handleInteraction);

        return () => {
            clearInterval(heartbeatInterval);
            resonanceObserver.disconnect();
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleInteraction);

            // 6. PROTOCOL: FINAL TRANSMISSION
            const duration = Math.round((Date.now() - startTime.current) / 1000);
            trackEventAction(storeId, pathname, 'session_end', {
                duration,
                maxScrollDepth: scrollDepth.current,
                exitPath: pathname
            }).catch(() => { });
        };
    }, [storeId, pathname]);

    return null; // The Beacon is invisible. Truth is silent.
}
