/**
 * Micro-feedbacks System
 * 
 * Instant, human-friendly feedback for every user action
 * No boring success messages - the button itself transforms
 * No technical errors - human language with shake animation
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type FeedbackState = "idle" | "loading" | "success" | "error";

export interface MicroFeedbackProps {
    children: React.ReactNode;
    state: FeedbackState;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: () => void;
    onError?: () => void;
}

export interface UseMicroFeedbackReturn {
    state: FeedbackState;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    triggerSuccess: (message?: string) => void;
    triggerError: (message?: string) => void;
    reset: () => void;
    wrapAction: (action: () => Promise<void>) => Promise<void>;
}

// ============================================================================
// MICRO FEEDBACK HOOK
// ============================================================================

export function useMicroFeedback(
    onSuccess?: () => void,
    onError?: () => void
): UseMicroFeedbackReturn {
    const [state, setState] = useState<FeedbackState>("idle");
    const [message, setMessage] = useState<string>("");

    const triggerSuccess = (successMessage: string = "تم بنجاح!") => {
        setMessage(successMessage);
        setState("success");
        onSuccess?.();

        // Auto-reset after 2 seconds
        setTimeout(() => {
            setState("idle");
            setMessage("");
        }, 2000);
    };

    const triggerError = (errorMessage: string = "حدث خطأ ما") => {
        setMessage(errorMessage);
        setState("error");
        onError?.();

        // Auto-reset after 3 seconds
        setTimeout(() => {
            setState("idle");
            setMessage("");
        }, 3000);
    };

    const reset = () => {
        setState("idle");
        setMessage("");
    };

    const wrapAction = async (action: () => Promise<void>) => {
        setState("loading");
        try {
            await action();
            triggerSuccess();
        } catch (error) {
            triggerError(
                error instanceof Error ? error.message : "حدث خطأ غير متوقع"
            );
        }
    };

    return {
        state,
        isLoading: state === "loading",
        isSuccess: state === "success",
        isError: state === "error",
        triggerSuccess,
        triggerError,
        reset,
        wrapAction,
    };
}

// ============================================================================
// MICRO FEEDBACK BUTTON
// ============================================================================

export interface MicroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loadingText?: string;
    successText?: string;
    errorText?: string;
}

export const MicroButton: React.FC<MicroButtonProps> = ({
    children,
    loadingText = "جاري التحميل...",
    successText = "✓ تم!",
    errorText = "✗ خطأ",
    onClick,
    disabled,
    ...props
}) => {
    const { state, wrapAction } = useMicroFeedback();

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (state === "loading") return;

        if (onClick) {
            await wrapAction(async () => {
                await onClick(e);
            });
        }
    };

    return (
        <motion.button
            onClick={handleClick}
            disabled={disabled || state === "loading"}
            animate={{
                scale: state === "success" ? 1.05 : 1,
                x: state === "error" ? [-5, 5, -5, 5, 0] : 0,
            }}
            transition={{
                duration: state === "error" ? 0.4 : 0.2,
            }}
            className={`
                relative px-6 py-3 rounded-[12px] font-medium
                transition-all duration-300
                ${state === "success"
                    ? "bg-success text-white"
                    : state === "error"
                    ? "bg-error text-white"
                    : "bg-grad-premium text-white hover:shadow-glow-primary"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
            {...props}
        >
            <AnimatePresence mode="wait">
                {state === "loading" ? (
                    <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                    >
                        <LoadingSpinner />
                        {loadingText}
                    </motion.span>
                ) : state === "success" ? (
                    <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                    >
                        <CheckCircleIcon />
                        {successText}
                    </motion.span>
                ) : state === "error" ? (
                    <motion.span
                        key="error"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                    >
                        <ErrorCircleIcon />
                        {errorText}
                    </motion.span>
                ) : (
                    <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {children}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

// ============================================================================
// FEEDBACK TOAST
// ============================================================================

export interface FeedbackToastProps {
    message: string;
    type: "success" | "error" | "info";
    onClose: () => void;
    duration?: number;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
    message,
    type,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const icons = {
        success: <CheckCircleIcon className="text-success" />,
        error: <ErrorCircleIcon className="text-error" />,
        info: <InfoIcon className="text-info" />,
    };

    const bgColors = {
        success: "bg-success/10 border-success/20",
        error: "bg-error/10 border-error/20",
        info: "bg-info/10 border-info/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`
                fixed bottom-6 right-6 z-50
                flex items-center gap-3 px-6 py-4
                border rounded-[16px] shadow-2xl
                backdrop-blur-xl
                ${bgColors[type]}
            `}
        >
            {icons[type]}
            <p className="text-white font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
            >
                <CloseIcon />
            </button>
        </motion.div>
    );
};

// ============================================================================
// INLINE FEEDBACK
// ============================================================================

export interface InlineFeedbackProps {
    type: "success" | "error" | "warning" | "info";
    message: string;
    icon?: React.ReactNode;
}

export const InlineFeedback: React.FC<InlineFeedbackProps> = ({
    type,
    message,
    icon,
}) => {
    const styles = {
        success: "text-success bg-success/5 border-success/20",
        error: "text-error bg-error/5 border-error/20",
        warning: "text-warning bg-warning/5 border-warning/20",
        info: "text-info bg-info/5 border-info/20",
    };

    const defaultIcons = {
        success: <CheckCircleIcon className="flex-shrink-0" />,
        error: <ErrorCircleIcon className="flex-shrink-0" />,
        warning: <WarningIcon className="flex-shrink-0" />,
        info: <InfoIcon className="flex-shrink-0" />,
    };

    return (
        <div
            className={`
                flex items-start gap-3 px-4 py-3
                border rounded-[12px]
                ${styles[type]}
            `}
        >
            {icon || defaultIcons[type]}
            <p className="text-sm leading-relaxed">{message}</p>
        </div>
    );
};

// ============================================================================
// SHAKE ANIMATION WRAPPER
// ============================================================================

export interface ShakeProps {
    children: React.ReactNode;
    trigger?: boolean;
    intensity?: "low" | "medium" | "high";
}

export const Shake: React.FC<ShakeProps> = ({
    children,
    trigger = false,
    intensity = "medium",
}) => {
    const intensities = {
        low: { x: [-2, 2, -2, 2, 0] },
        medium: { x: [-5, 5, -5, 5, 0] },
        high: { x: [-10, 10, -10, 10, 0] },
    };

    return (
        <motion.div
            animate={trigger ? intensities[intensity] : { x: 0 }}
            transition={{ duration: 0.4 }}
        >
            {children}
        </motion.div>
    );
};

// ============================================================================
// FORM FEEDBACK
// ============================================================================

export interface FormFieldFeedbackProps {
    label: string;
    error?: string;
    success?: boolean;
    children: React.ReactNode;
}

export const FormFieldFeedback: React.FC<FormFieldFeedbackProps> = ({
    label,
    error,
    success,
    children,
}) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
                {label}
            </label>
            <div className="relative">
                {children}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-success"
                    >
                        <CheckCircleIcon size={20} />
                    </motion.div>
                )}
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

// ============================================================================
// HUMAN-FRIENDLY ERROR MESSAGES
// ============================================================================

export function getHumanErrorMessage(error: string): string {
    const errorMap: Record<string, string> = {
        // Network errors
        "NetworkError": "عذراً، يبدو أن اتصالك بالإنترنت ضعيف. يرجى التحقق والمحاولة مرة أخرى.",
        "TimeoutError": "استغرق الطلب وقتاً طويلاً. يرجى المحاولة مرة أخرى.",
        
        // Validation errors
        "InvalidEmail": "عذراً، هذا البريد الإلكتروني غير صالح. يرجى التحقق من الصيغة.",
        "InvalidURL": "عذراً، هذا الرابط غير صالح. يرجى التأكد من الصيغة.",
        "RequiredField": "هذا الحقل مطلوب. يرجى ملؤه للمتابعة.",
        "TooShort": "النص قصير جداً. يرجى كتابة المزيد من التفاصيل.",
        "TooLong": "النص طويل جداً. يرجى الاختصار.",
        
        // Auth errors
        "Unauthorized": "عذراً، يبدو أنك غير مسجل الدخول. يرجى تسجيل الدخول والمحاولة مرة أخرى.",
        "Forbidden": "عذراً، ليس لديك صلاحية للقيام بهذا الإجراء.",
        
        // Server errors
        "ServerError": "حدث خطأ غير متوقع في الخادم. يرجى المحاولة بعد قليل.",
        "ServiceUnavailable": "الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.",
        
        // File errors
        "FileTooLarge": "حجم الملف كبير جداً. يرجى رفع ملف أصغر من 5 ميجابايت.",
        "InvalidFileType": "نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG أو PNG.",
        
        // Default
        "default": "عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    };

    // Find matching error or return default
    for (const [key, message] of Object.entries(errorMap)) {
        if (error.toLowerCase().includes(key.toLowerCase())) {
            return message;
        }
    }

    return errorMap.default;
}

// ============================================================================
// ICONS
// ============================================================================

function LoadingSpinner() {
    return (
        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
        </svg>
    );
}

function CheckCircleIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

function ErrorCircleIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    );
}

function InfoIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

function WarningIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    useMicroFeedback,
    MicroButton,
    FeedbackToast,
    InlineFeedback,
    Shake,
    FormFieldFeedback,
    getHumanErrorMessage,
};
