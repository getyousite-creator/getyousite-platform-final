/**
 * Mesh Gradient Canvas - High Performance Animated Background
 * 
 * Uses Canvas API + requestAnimationFrame for smooth 60fps animation
 * Colors from VIP Sovereign Palette (Emerald Cyber-Noir)
 * CPU-efficient alternative to video backgrounds
 */

"use client";

import React, { useEffect, useRef } from 'react';

interface MeshGradientProps {
    className?: string;
    opacity?: number;
}

export function MeshGradient({ className = '', opacity = 0.3 }: MeshGradientProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to window size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // VIP Sovereign Palette Colors (Emerald Cyber-Noir)
        const colors = [
            { r: 6, g: 78, b: 59, x: 0.2, y: 0.3 },    // Emerald deep
            { r: 5, g: 150, b: 105, x: 0.5, y: 0.6 },  // Emerald
            { r: 190, g: 242, b: 100, x: 0.8, y: 0.4 }, // Accent neon
            { r: 10, g: 10, b: 10, x: 0.3, y: 0.8 },   // Obsidian
        ];

        let time = 0;
        let animationFrameId: number;

        const animate = () => {
            time += 0.0005;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create gradient layers
            colors.forEach((color, index) => {
                // Animate position with sine waves
                const x = (Math.sin(time + index * 2) + 1) / 2 * canvas.width;
                const y = (Math.cos(time * 1.5 + index * 1.5) + 1) / 2 * canvas.height;

                // Create radial gradient for each color orb
                const gradient = ctx.createRadialGradient(
                    x, y, 0,
                    x, y, Math.max(canvas.width, canvas.height) * 0.4
                );

                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.4})`);
                gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.2})`);
                gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });

            // Add subtle noise texture overlay (optional, for depth)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Subtle grain effect (every 10th pixel for performance)
            for (let i = 0; i < data.length; i += 40) {
                const grain = (Math.random() - 0.5) * 10;
                data[i] = Math.min(255, Math.max(0, data[i] + grain));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
            }
            
            ctx.putImageData(imageData, 0, 0);

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [opacity]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 z-0 ${className}`}
            style={{ pointerEvents: 'none' }}
            aria-hidden="true"
        />
    );
}
