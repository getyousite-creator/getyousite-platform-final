"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SovereignImageProps extends Omit<ImageProps, "onLoad"> {
    fallbackSrc?: string;
}

export function SovereignImage({ src, alt, className, fallbackSrc = "/placeholder-image.jpg", ...props }: SovereignImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-zinc-800 animate-pulse z-10"
                    />
                )}
            </AnimatePresence>

            <Image
                src={error ? fallbackSrc : src}
                alt={alt}
                className={`transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
                onLoad={() => setIsLoading(false)}
                onError={() => { setError(true); setIsLoading(false); }}
                {...props}
            />
        </div>
    );
}
