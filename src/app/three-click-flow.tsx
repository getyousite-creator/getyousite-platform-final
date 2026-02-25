/**
 * 3-Click Architecture - Zero-Friction Flow
 * 
 * From description to deployment in exactly 3 clicks:
 * 1. Enter site description (Strategic Input)
 * 2. Review & Edit (Live Preview)
 * 3. One-Click Deploy
 * 
 * Rigor: Any modal asking for >2 info fields is cancelled immediately
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ThreeClickFlowProps {
    onSiteGenerated?: (siteId: string) => void;
    onDeployComplete?: (url: string) => void;
}

export type FlowStep = "input" | "preview" | "deploy" | "complete";

// ============================================================================
// MAIN 3-CLICK FLOW COMPONENT
// ============================================================================

export const ThreeClickFlow: React.FC<ThreeClickFlowProps> = ({
    onSiteGenerated,
    onDeployComplete,
}) => {
    const [currentStep, setCurrentStep] = useState<FlowStep>("input");
    const [siteDescription, setSiteDescription] = useState("");
    const [generatedSiteId, setGeneratedSiteId] = useState<string | null>(null);
    const [deployedUrl, setDeployedUrl] = useState<string | null>(null);

    // Step 1: Input → Generate
    const handleGenerate = async (description: string) => {
        // Initiate Sovereign Synthesis Protocol
        setSiteDescription(description);

        // Simulate generation (in production, call API)
        await new Promise(resolve => setTimeout(resolve, 2000));

        setGeneratedSiteId("site-123");
        setCurrentStep("preview");

        onSiteGenerated?.("site-123");
    };

    // Step 2: Preview → Deploy
    const handleDeploy = async () => {
        // Call deploy API
        await new Promise(resolve => setTimeout(resolve, 1500));

        setDeployedUrl("https://yoursite.GYS Global.com");
        setCurrentStep("complete");

        onDeployComplete?.("https://yoursite.GYS Global.com");
    };

    // Step 3: Complete → Done
    const handleComplete = () => {
        // Flow complete
        console.log("Flow complete!");
    };

    return (
        <div className="min-h-screen bg-neutral-obsidian">
            {/* Progress Indicator */}
            <ProgressIndicator currentStep={currentStep} />

            {/* Step Content */}
            <AnimatePresence mode="wait">
                {currentStep === "input" && (
                    <InputStep
                        key="input"
                        onGenerate={handleGenerate}
                    />
                )}
                {currentStep === "preview" && (
                    <PreviewStep
                        key="preview"
                        siteId={generatedSiteId!}
                        onBack={() => setCurrentStep("input")}
                        onDeploy={handleDeploy}
                    />
                )}
                {currentStep === "deploy" && (
                    <DeployStep
                        key="deploy"
                        siteId={generatedSiteId!}
                        onDeploy={handleDeploy}
                    />
                )}
                {currentStep === "complete" && (
                    <CompleteStep
                        key="complete"
                        url={deployedUrl!}
                        onComplete={handleComplete}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================================
// PROGRESS INDICATOR
// ============================================================================

interface ProgressIndicatorProps {
    currentStep: FlowStep;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
    const steps = [
        { id: "input", label: "الوصف" },
        { id: "preview", label: "المعاينة" },
        { id: "deploy", label: "النشر" },
        { id: "complete", label: "تم" },
    ];

    const getCurrentIndex = () => {
        if (currentStep === "input") return 0;
        if (currentStep === "preview") return 1;
        if (currentStep === "deploy" || currentStep === "complete") return 2;
        return 0;
    };

    const currentIndex = getCurrentIndex();

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-neutral-obsidian/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center
                                        transition-all duration-300
                                        ${index <= currentIndex
                                            ? "bg-grad-premium text-white"
                                            : "bg-white/5 text-neutral-slate"
                                        }
                                    `}
                                >
                                    {index < currentIndex ? (
                                        <CheckIcon />
                                    ) : (
                                        <span className="text-sm font-bold">
                                            {index + 1}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={`
                                        text-sm font-medium transition-colors
                                        ${index <= currentIndex
                                            ? "text-white"
                                            : "text-neutral-slate"
                                        }
                                    `}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`
                                        flex-1 h-0.5 mx-4 transition-all duration-300
                                        ${index < currentIndex
                                            ? "bg-grad-premium"
                                            : "bg-white/10"
                                        }
                                    `}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// STEP 1: INPUT
// ============================================================================

interface InputStepProps {
    onGenerate: (description: string) => void;
}

const InputStep: React.FC<InputStepProps> = ({ onGenerate }) => {
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description.trim()) {
            onGenerate(description);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center min-h-screen pt-20 px-6"
        >
            <div className="max-w-2xl w-full">
                <h2 className="text-4xl font-bold text-white text-center mb-4">
                    صِف موقعك المثالي
                </h2>
                <p className="text-xl text-neutral-slate text-center mb-12">
                    اكتب وصفاً بسيطاً، وسنقوم بتوليف الموقع وفق أرقى المعايير الهندسية
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="مثال: أريد موقعاً لمطعم إيطالي راقي في الرياض، مع قائمة طعام ونظام حجز مواعيد..."
                            className="w-full h-40 px-6 py-4 bg-white/5 border border-white/10 rounded-[16px] text-white placeholder:text-neutral-slate focus:outline-none focus:ring-2 focus:ring-primary resize-none text-lg"
                            maxLength={500}
                        />
                        <div className="absolute bottom-4 right-4 text-sm text-neutral-slate">
                            {description.length}/500
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!description.trim()}
                        className="w-full py-4 bg-grad-premium text-white font-bold rounded-[16px] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-primary transition-all"
                    >
                        توليد الموقع ✨
                    </button>

                    <p className="text-sm text-neutral-slate text-center">
                        ⚡ يستغرق حوالي 30 ثانية • لا يحتاج بطاقة ائتمان
                    </p>
                </form>
            </div>
        </motion.div>
    );
};

// ============================================================================
// STEP 2: PREVIEW
// ============================================================================

interface PreviewStepProps {
    siteId: string;
    onBack: () => void;
    onDeploy: () => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ siteId, onBack, onDeploy }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen pt-24 pb-12 px-6"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white">عاين موقعك</h2>
                        <p className="text-neutral-slate mt-1">
                            عدل أي شيء تريد قبل النشر
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[12px] text-white transition-all"
                        >
                            رجوع
                        </button>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[12px] text-white transition-all"
                        >
                            {isEditing ? "إنهاء التعديل" : "تعديل"}
                        </button>
                        <button
                            onClick={onDeploy}
                            className="px-8 py-3 bg-grad-premium text-white font-bold rounded-[12px] hover:shadow-glow-primary transition-all"
                        >
                            نشر الموقع 🚀
                        </button>
                    </div>
                </div>

                {/* Preview Frame */}
                <div className="aspect-video bg-white rounded-[16px] overflow-hidden border border-white/10 shadow-2xl">
                    <iframe
                        src={`/preview/${siteId}`}
                        className="w-full h-full"
                        title="Site Preview"
                    />
                </div>

                {/* Quick Tips */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <TipCard
                        icon="✏️"
                        title="عدل بالنقر"
                        description="انقر على أي نص لتعديله مباشرة"
                    />
                    <TipCard
                        icon="🎨"
                        title="غيّر الألوان"
                        description="اختر من لوحة الألوان الجاهزة"
                    />
                    <TipCard
                        icon="📱"
                        title="تجاوب كامل"
                        description="عاين على جميع أحجام الشاشات"
                    />
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// STEP 3: DEPLOY (Simplified - integrated into Preview)
// ============================================================================

interface DeployStepProps {
    siteId: string;
    onDeploy: () => void;
}

const DeployStep: React.FC<DeployStepProps> = ({ siteId, onDeploy }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
        >
            <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-grad-premium rounded-full flex items-center justify-center">
                    <RocketIcon />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                    جاهز للنشر؟
                </h2>
                <p className="text-xl text-neutral-slate mb-8">
                    سيتم نشر موقعك خلال ثوانٍ
                </p>
                <button
                    onClick={onDeploy}
                    className="px-12 py-4 bg-grad-premium text-white font-bold rounded-[16px] hover:shadow-glow-primary transition-all"
                >
                    نعم، انشره! 🚀
                </button>
            </div>
        </motion.div>
    );
};

// ============================================================================
// STEP 4: COMPLETE
// ============================================================================

interface CompleteStepProps {
    url: string;
    onComplete: () => void;
}

const CompleteStep: React.FC<CompleteStepProps> = ({ url, onComplete }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
        >
            <div className="text-center max-w-2xl">
                <div className="w-24 h-24 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center">
                    <SuccessIcon />
                </div>
                <h2 className="text-5xl font-bold text-white mb-4">
                    🎉 مبروك!
                </h2>
                <p className="text-2xl text-neutral-slate mb-8">
                    تم نشر موقعك بنجاح
                </p>

                <div className="bg-white/5 border border-white/10 rounded-[16px] p-6 mb-8">
                    <p className="text-sm text-neutral-slate mb-2">رابط موقعك:</p>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl text-primary font-mono hover:underline"
                    >
                        {url.replace('https://yoursite.GYS Global.com', 'https://yournode.gysglobal.com')}
                    </a>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onComplete}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-[12px] text-white transition-all"
                    >
                        إنشاء موقع آخر
                    </button>
                    <a
                        href={url}
                        target="_blank"
                        className="px-8 py-3 bg-grad-premium text-white font-bold rounded-[12px] hover:shadow-glow-primary transition-all"
                    >
                        زيارة الموقع 🌐
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function TipCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="p-4 bg-white/5 border border-white/10 rounded-[12px]">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-neutral-slate">{description}</p>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function RocketIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.85.78-2.35.78-2.35s-1.5-.07-2.35-.78a3.5 3.5 0 0 1-1.43-1.87z" />
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
    );
}

function SuccessIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-success">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    ThreeClickFlow,
};
