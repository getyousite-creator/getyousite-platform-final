"use client";

import { useEffect } from 'react';

export function PwaProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                        console.log('Sovereign ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    (err) => {
                        console.log('Sovereign ServiceWorker registration failed: ', err);
                    }
                );
            });
        }
    }, []);

    return <>{children}</>;
}
