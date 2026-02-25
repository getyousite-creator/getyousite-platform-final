"use client";

import React, { useEffect, useRef } from 'react';

export default function MeshGradient() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let time = 0;

        const animate = () => {
            time += 0.002;
            ctx.clearRect(0, 0, width, height);

            // We create a sophisticated mesh using multiple overlapping gradients
            // This is CPU-efficient compared to SVG/Framer Motion blends

            const grad1 = ctx.createRadialGradient(
                width * (0.5 + Math.sin(time * 0.7) * 0.3),
                height * (0.5 + Math.cos(time * 0.5) * 0.3),
                0,
                width * 0.5,
                height * 0.5,
                width * 0.8
            );
            grad1.addColorStop(0, 'rgba(190, 242, 100, 0.15)'); // neon-lime
            grad1.addColorStop(1, 'rgba(2, 6, 23, 0)');

            const grad2 = ctx.createRadialGradient(
                width * (0.2 + Math.cos(time * 0.4) * 0.2),
                height * (0.8 + Math.sin(time * 0.6) * 0.2),
                0,
                width * 0.3,
                height * 0.7,
                width * 0.6
            );
            grad2.addColorStop(0, 'rgba(6, 78, 59, 0.3)'); // green-900
            grad2.addColorStop(1, 'rgba(2, 6, 23, 0)');

            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = grad2;
            ctx.fillRect(0, 0, width, height);

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none opacity-50 blur-3xl"
            aria-hidden="true"
        />
    );
}
