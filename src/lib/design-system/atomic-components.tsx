/**
 * Atomic Design System - Sovereign Components
 * 
 * Premium React components following atomic design principles
 * - Buttons: 8px radius with inner shadow glass effect
 * - Cards: Frosted glassmorphism in dark mode
 * - Icons: Custom 1.5px stroke with squared edges
 */

import React from "react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "accent" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    glow?: boolean;
}

export interface CardProps {
    children: React.ReactNode;
    variant?: "default" | "elevated" | "glass" | "frosted";
    padding?: "none" | "sm" | "md" | "lg";
    hoverable?: boolean;
    className?: string;
}

export interface IconProps {
    children: React.ReactNode;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

/**
 * Sovereign Button
 * 
 * Features:
 * - 8px border radius (slightly rounded)
 * - Inner shadow for glass-like texture
 * - Magnetic hover effect (with Framer Motion)
 * - Neon glow option for accent buttons
 */
export const SovereignButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            loading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            glow = false,
            className = "",
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        // Base classes
        const baseClasses = `
            inline-flex items-center justify-center
            font-medium transition-all duration-300
            rounded-[8px]
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${fullWidth ? "w-full" : ""}
            ${className}
        `.trim();

        // Size classes
        const sizeClasses = {
            sm: "px-3 py-1.5 text-sm gap-1.5",
            md: "px-5 py-2.5 text-base gap-2",
            lg: "px-7 py-3.5 text-lg gap-2.5",
        };

        // Variant classes
        const variantClasses = {
            primary: `
                bg-primary-deep text-white
                hover:bg-primary
                active:bg-primary-light
                shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                focus:ring-primary
            `,
            secondary: `
                bg-neutral-slate text-white
                hover:bg-neutral-light
                active:bg-neutral
                shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                focus:ring-neutral-slate
            `,
            accent: `
                bg-accent-neon text-neutral-obsidian
                hover:bg-accent
                active:bg-accent-dim
                shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]
                focus:ring-accent-neon
                ${glow ? "shadow-[0_0_20px_rgba(190,242,100,0.4)]" : ""}
            `,
            ghost: `
                bg-transparent text-white
                hover:bg-neutral/10
                active:bg-neutral/20
                focus:ring-neutral-slate
            `,
            outline: `
                bg-transparent text-white
                border border-neutral-slate
                hover:bg-neutral/10
                active:bg-neutral/20
                focus:ring-neutral-slate
            `,
        };

        return (
            <button
                ref={ref}
                className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <LoadingSpinner size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
                ) : (
                    <>
                        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

SovereignButton.displayName = "SovereignButton";

// ============================================================================
// CARD COMPONENT
// ============================================================================

/**
 * Sovereign Card
 * 
 * Features:
 * - Frosted glassmorphism in dark mode
 * - 8px border radius
 * - Subtle inner shadow for depth
 * - Optional hover lift effect
 */
export const SovereignCard: React.FC<CardProps> = ({
    children,
    variant = "default",
    padding = "md",
    hoverable = false,
    className = "",
}) => {
    const baseClasses = `
        rounded-[8px]
        transition-all duration-300
        ${className}
    `.trim();

    const variantClasses = {
        default: `
            bg-surface
            border border-neutral-slate/20
        `,
        elevated: `
            bg-surface-elevated
            border border-neutral-slate/20
            shadow-emerald-lg
        `,
        glass: `
            bg-white/5 backdrop-blur-md
            border border-white/10
            shadow-emerald-lg
        `,
        frosted: `
            bg-neutral-obsidian/80 backdrop-blur-xl
            border border-white/5
            shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
        `,
    };

    const paddingClasses = {
        none: "",
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
    };

    const hoverClasses = hoverable
        ? "hover:shadow-emerald-xl hover:-translate-y-1 cursor-pointer"
        : "";

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses}`}>
            {children}
        </div>
    );
};

// ============================================================================
// ICON COMPONENT
// ============================================================================

/**
 * Sovereign Icon
 * 
 * Features:
 * - Custom 1.5px stroke width
 * - Squared edges (stroke-linecap: square)
 * - Consistent sizing
 */
export const SovereignIcon: React.FC<IconProps> = ({
    children,
    size = 20,
    strokeWidth = 1.5,
    color = "currentColor",
}) => {
    return React.cloneElement(children as React.ReactElement, {
        width: size,
        height: size,
        stroke: color,
        strokeWidth,
        strokeLinecap: "square",
        strokeLinejoin: "miter",
    });
};

// ============================================================================
// LOADING SPINNER
// ============================================================================

interface LoadingSpinnerProps {
    size?: number;
    color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 20,
    color = "currentColor",
}) => {
    return (
        <svg
            className="animate-spin"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="square"
                strokeOpacity="0.25"
            />
            <path
                d="M12 2C6.48 2 2 6.48 2 12"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="square"
                strokeOpacity="1"
            />
        </svg>
    );
};

// ============================================================================
// BADGE COMPONENT
// ============================================================================

export interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "error" | "info" | "accent";
    size?: "sm" | "md";
    className?: string;
}

export const SovereignBadge: React.FC<BadgeProps> = ({
    children,
    variant = "default",
    size = "md",
    className = "",
}) => {
    const baseClasses = `
        inline-flex items-center justify-center
        font-medium rounded-[8px]
        transition-all duration-300
        ${className}
    `.trim();

    const variantClasses = {
        default: "bg-neutral-slate text-white",
        success: "bg-success/20 text-success border border-success/30",
        warning: "bg-warning/20 text-warning border border-warning/30",
        error: "bg-error/20 text-error border border-error/30",
        info: "bg-info/20 text-info border border-info/30",
        accent: "bg-accent-neon/20 text-accent-neon border border-accent-neon/30",
    };

    const sizeClasses = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
    };

    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
            {children}
        </span>
    );
};

// ============================================================================
// DIVIDER COMPONENT
// ============================================================================

export interface DividerProps {
    orientation?: "horizontal" | "vertical";
    className?: string;
}

export const SovereignDivider: React.FC<DividerProps> = ({
    orientation = "horizontal",
    className = "",
}) => {
    const baseClasses = `
        bg-neutral-slate/30
        ${orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full"}
        ${className}
    `.trim();

    return <div className={baseClasses} />;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    SovereignButton,
    SovereignCard,
    SovereignIcon,
    LoadingSpinner,
    SovereignBadge,
    SovereignDivider,
};
