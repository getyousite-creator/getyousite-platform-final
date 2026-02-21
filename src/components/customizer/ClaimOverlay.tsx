'use client';

// Overlay disabled to keep the customizer clean during trial mode and avoid mixed-language clutter.
// Re-enable with proper i18n and UX later.
export interface ClaimOverlayProps {
    isVisible: boolean;
    onClaim: () => void;
}

export default function ClaimOverlay(_: ClaimOverlayProps) {
    return null;
}

