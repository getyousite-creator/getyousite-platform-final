"use client";

import { useState, useRef, useEffect } from "react";

import { Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface CinematicVideoProps {
    videoUrl: string;
    posterUrl: string;
    className?: string;
    autoPlay?: boolean;
    muted?: boolean;
    overlayContent?: React.ReactNode;
}

export default function CinematicVideo({
    videoUrl,
    posterUrl,
    className,
    autoPlay = true,
    muted = true,
    overlayContent
}: CinematicVideoProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(() => {
                // Autoplay blocked
            });
        }
    }, [autoPlay]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className={cn("relative overflow-hidden group w-full h-full", className)}>
            <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                loop
                muted={isMuted}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear group-hover:scale-105"
            />

            {/* Subtle Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-muted-foreground/10 via-transparent to-muted-foreground/5 opacity-100 pointer-events-none" />

            {/* Controls Layer */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-4">
                    <button
                        onClick={togglePlay}
                        className="p-3 rounded-full bg-secondary/10 backdrop-blur-md border border-border hover:bg-secondary/20 transition-all"
                    >
                        {isPlaying ? <span className="w-4 h-4 block border-l-2 border-r-2 border-muted-foreground mx-0.5" /> : <Play className="w-4 h-4 fill-current text-foreground" />}
                    </button>
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-3 rounded-full bg-secondary/10 backdrop-blur-md border border-border hover:bg-secondary/20 transition-all"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4 text-foreground" /> : <Volume2 className="w-4 h-4 text-foreground" />}
                    </button>
                </div>
            </div>

            {overlayContent && (
                <div className="absolute inset-0 z-10">
                    {overlayContent}
                </div>
            )}
        </div>
    );
}
