/**
 * Responsive Preview Engine
 * 
 * Not just "shrinking iframe" - structural rebuild for each viewport
 * Real device simulation with proper borders and aspect ratios
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface ViewportControllerProps {
    children: React.ReactNode;
    activeDevice?: DeviceType;
    onDeviceChange?: (device: DeviceType) => void;
    showControls?: boolean;
}

export interface DeviceFrameProps {
    device: DeviceType;
    children: React.ReactNode;
    className?: string;
}

// ============================================================================
// VIEWPORT CONTROLLER
// ============================================================================

export const ViewportController: React.FC<ViewportControllerProps> = ({
    children,
    activeDevice = "desktop",
    onDeviceChange,
    showControls = true,
}) => {
    const [isRotated, setIsRotated] = useState(false);

    const getWidth = (): string => {
        switch (activeDevice) {
            case "mobile":
                return isRotated ? "667px" : "375px";
            case "tablet":
                return isRotated ? "1024px" : "768px";
            default:
                return "100%";
        }
    };

    const getDeviceName = (): string => {
        switch (activeDevice) {
            case "mobile":
                return isRotated ? "Mobile Landscape" : "Mobile Portrait";
            case "tablet":
                return isRotated ? "Tablet Landscape" : "Tablet Portrait";
            default:
                return "Desktop";
        }
    };

    return (
        <div className="w-full">
            {/* Device Controls */}
            {showControls && (
                <DeviceControls
                    activeDevice={activeDevice}
                    onDeviceChange={onDeviceChange}
                    isRotated={isRotated}
                    onRotate={() => setIsRotated(!isRotated)}
                />
            )}

            {/* Preview Frame */}
            <div className="flex-1 flex items-center justify-center p-8 bg-neutral-obsidian overflow-hidden">
                <motion.div
                    animate={{
                        width: getWidth(),
                        rotate: isRotated ? 90 : 0,
                    }}
                    transition={{
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="relative"
                >
                    <DeviceFrame device={activeDevice}>
                        <iframe
                            src="/preview-target"
                            className="w-full h-full bg-white"
                            title={`${getDeviceName()} Preview`}
                            sandbox="allow-same-origin allow-scripts"
                        />
                    </DeviceFrame>

                    {/* Device Label */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-neutral-slate whitespace-nowrap">
                        {getDeviceName()} ({getWidth()})
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// ============================================================================
// DEVICE FRAME COMPONENT
// ============================================================================

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
    device,
    children,
    className = "",
}) => {
    if (device === "desktop") {
        return (
            <div
                className={`
                    bg-white rounded-[8px] overflow-hidden
                    border border-white/10 shadow-2xl
                    ${className}
                `}
                style={{
                    aspectRatio: "16/9",
                    maxHeight: "calc(100vh - 200px)",
                }}
            >
                {children}
            </div>
        );
    }

    if (device === "tablet") {
        return (
            <div
                className={`
                    relative bg-neutral-obsidian rounded-[2rem] p-3
                    border-8 border-neutral-obsidian shadow-2xl
                    ${className}
                `}
                style={{
                    aspectRatio: "4/3",
                }}
            >
                {/* Tablet bezel */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-neutral-900 rounded-full" />
                
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[1rem] overflow-hidden">
                    {children}
                </div>
            </div>
        );
    }

    // Mobile
    return (
        <div
            className={`
                relative bg-neutral-obsidian rounded-[2.5rem] p-3
                border-8 border-neutral-obsidian shadow-2xl
                ${className}
            `}
            style={{
                aspectRatio: "19.5/9",
            }}
        >
            {/* Mobile bezel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-neutral-900 rounded-full" />
            
            {/* Screen */}
            <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
                {children}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
        </div>
    );
};

// ============================================================================
// DEVICE CONTROLS
// ============================================================================

interface DeviceControlsProps {
    activeDevice: DeviceType;
    onDeviceChange?: (device: DeviceType) => void;
    isRotated: boolean;
    onRotate: () => void;
}

const DeviceControls: React.FC<DeviceControlsProps> = ({
    activeDevice,
    onDeviceChange,
    isRotated,
    onRotate,
}) => {
    return (
        <div className="flex items-center justify-center gap-4 p-4 bg-white/5 border-b border-white/10">
            {/* Device Toggles */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-[12px]">
                <DeviceButton
                    icon={<MobileIcon />}
                    label="Mobile"
                    active={activeDevice === "mobile"}
                    onClick={() => onDeviceChange?.("mobile")}
                />
                <DeviceButton
                    icon={<TabletIcon />}
                    label="Tablet"
                    active={activeDevice === "tablet"}
                    onClick={() => onDeviceChange?.("tablet")}
                />
                <DeviceButton
                    icon={<DesktopIcon />}
                    label="Desktop"
                    active={activeDevice === "desktop"}
                    onClick={() => onDeviceChange?.("desktop")}
                />
            </div>

            {/* Rotate Button */}
            <button
                onClick={onRotate}
                disabled={activeDevice === "desktop"}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-[12px] text-white transition-all"
            >
                <RotateIcon />
                <span className="text-sm font-medium">
                    {isRotated ? "Portrait" : "Landscape"}
                </span>
            </button>

            {/* Zoom Controls would go here */}
        </div>
    );
};

interface DeviceButtonProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

const DeviceButton: React.FC<DeviceButtonProps> = ({
    icon,
    label,
    active,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-[10px] transition-all
                ${active
                    ? "bg-primary text-white"
                    : "text-neutral-slate hover:text-white"
                }
            `}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
};

// ============================================================================
// ICONS
// ============================================================================

function MobileIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    );
}

function TabletIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    );
}

function DesktopIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    );
}

function RotateIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    ViewportController,
    DeviceFrame,
};
