"use client";

import { useEffect } from 'react';

export function PwaProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    () => {
                        // Registration successful
                    },
                    () => {
                        // Registration failed
                    }
                );
            });
        }
    }, []);

    return <>{children}</>;
}
