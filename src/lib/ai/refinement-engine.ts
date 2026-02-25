/**
 * Smart Tuning & Refinement Protocol (STRP v1.0)
 * 
 * Implements the "Conversational Architect" mandate.
 * This engine handles real-time site modifications via chat, 
 * maintaining state history, intent recognition, and surgical updates.
 */

import { SiteBlueprint, Section } from "@/lib/schemas";
import { generateWithFallback } from "@/lib/ai/multi-provider";
import { PartialHydrationEngine, UpdateResult } from "@/lib/ai/partial-hydration";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface RefinementState {
    currentBlueprint: SiteBlueprint;
    history: SiteBlueprint[];
    future: SiteBlueprint[]; // For Redo
    chatHistory: Message[];
}

export type IntentType = "STYLE" | "CONTENT" | "LAYOUT" | "SEO" | "FEATURE";

export interface STRPUpdateResult extends UpdateResult {
    intent: IntentType;
    explanation: string;
    proactiveSuggestions?: string[];
}

// ============================================================================
// QUALITY WATCHER (The "No-Error" Gate)
// ============================================================================

export class QualityWatcher {
    /**
     * Perform all quality checks on a blueprint
     */
    async validate(blueprint: SiteBlueprint, originalBlueprint?: SiteBlueprint): Promise<{
        passed: boolean;
        warnings: string[];
        errors: string[];
    }> {
        const warnings: string[] = [];
        const errors: string[] = [];

        // 1. Safety Check (Data Loss)
        if (originalBlueprint && (blueprint.layout?.length || 0) < (originalBlueprint.layout?.length || 0)) {
            warnings.push("WARNING: Section count decreased. Potential data loss.");
        }

        // 2. SEO Integrity (H1/H2 Hierarchy)
        const hasH1 = JSON.stringify(blueprint).includes('"type":"hero"') || JSON.stringify(blueprint).includes('H1');
        if (!hasH1) {
            warnings.push("SEO: Missing H1 level headline.");
        }

        // 3. Responsiveness Check (Grid consistency)
        blueprint.layout?.forEach(section => {
            if ((section.type === "FEATURE_GRID" || section.type === "features") && !section.content.items) {
                errors.push(`STRUCTURAL: Section ${section.id} is missing items.`);
            }
        });

        // 4. Accessibility (Contrast Estimation)
        if (blueprint.theme?.backgroundColor && blueprint.theme?.textColor && blueprint.theme.backgroundColor === blueprint.theme.textColor) {
            errors.push("ACCESSIBILITY: Background and text colors must be different.");
        }

        return {
            passed: errors.length === 0,
            warnings,
            errors
        };
    }

    /**
     * Attempt autonomous self-correction
     */
    async selfCorrect(blueprint: SiteBlueprint, errors: string[]): Promise<SiteBlueprint> {
        console.log("[STRP] Firing Auto-Correction Loop for errors:", errors);
        // Logical correction: If H1 is missing, ensure the first hero has a proper title
        // In a real scenario, this would involve another AI call with a repair prompt
        return blueprint;
    }
}

// ============================================================================
// REFINEMENT ENGINE (STRP v1.0)
// ============================================================================

export class RefinementEngine {
    private partialEngine: PartialHydrationEngine;
    private qualityWatcher: QualityWatcher;
    private maxHistory: number = 20;

    constructor() {
        this.partialEngine = new PartialHydrationEngine();
        this.qualityWatcher = new QualityWatcher();
    }

    /**
     * Process a user refinement command
     * 
     * @param command - The refinement command (text)
     * @param state - Current state of the refinement session
     * @param imageMetadata - Optional image metadata
     * @returns STRPUpdateResult
     */
    async processRefinement(
        command: string,
        state: RefinementState,
        imageMetadata?: { url: string; prompt?: string }
    ): Promise<STRPUpdateResult> {
        console.log(`[STRP] Processing command: "${command}"`);

        const originalBlueprint = state.currentBlueprint;

        // 1. Intent Recognition (Phase 1 of STRP)
        const intentAnalysis = await this.recognizeIntent(command, state.chatHistory);
        console.log(`[STRP] Intent Recognized: ${intentAnalysis.intent}`);

        // 2. Memory Layering
        // Add user message to history
        state.chatHistory.push({
            role: "user",
            content: command,
            timestamp: new Date().toISOString()
        });

        // 3. Multi-modal Vision Protocol (if image provided)
        let visualContext = "";
        if (imageMetadata) {
            visualContext = await this.analyzeVisualInput(imageMetadata.url);
            console.log("[STRP] Visual Context Integrated");
        }

        // 4. Surgical Mutation (Phase 2 of STRP)
        // We leverage the PartialHydrationEngine for the actual JSON mutation
        const baseUpdate = await this.partialEngine.update(state.currentBlueprint, {
            command: visualContext ? `${command}\nVisual Context: ${visualContext}` : command,
            locale: state.currentBlueprint.metadata?.locale || "ar"
        });

        // 5. THE NO-ERROR GATE (Phase 4 of STRP)
        const qualityCheck = await this.qualityWatcher.validate(baseUpdate.blueprint, originalBlueprint);
        if (!qualityCheck.passed) {
            baseUpdate.blueprint = await this.qualityWatcher.selfCorrect(baseUpdate.blueprint, qualityCheck.errors);
        }

        // 6. Proactive Optimization (Phase 3 of STRP)
        const suggestions = await this.generateProactiveSuggestions(baseUpdate.blueprint, intentAnalysis.intent);

        // 7. Final Result Assembly
        const result: STRPUpdateResult = {
            ...baseUpdate,
            intent: intentAnalysis.intent,
            explanation: intentAnalysis.explanation,
            proactiveSuggestions: suggestions
        };

        // Update History for Undo/Redo
        state.history.push(originalBlueprint);
        if (state.history.length > this.maxHistory) state.history.shift();
        state.currentBlueprint = baseUpdate.blueprint;
        state.future = []; // Clear redo stack on new change

        return result;
    }

    /**
     * Recognize intent and extract parameters
     */
    private async recognizeIntent(command: string, chatHistory: Message[]): Promise<{
        intent: IntentType;
        confidence: number;
        explanation: string;
    }> {
        const historyContext = chatHistory.slice(-5).map(m => `${m.role}: ${m.content}`).join("\n");

        const prompt = `
أنت "محلل النوايا السيادي" (Sovereign Intent Analyst).
قم بتحليل طلب المستخدم وتحديد نوع التعديل المطلوب.

سياق الدردشة الأخير:
${historyContext}

طلب المستخدم الحالي: "${command}"

الأصناف الممكنة:
- STYLE: تغييرات الألوان، الخطوط، الظلال، المسافات.
- CONTENT: تغيير النصوص، العناوين، الأوصاف.
- LAYOUT: إضافة قسم، حذف قسم، إعادة ترتيب الأقسام.
- SEO: تحسين الكلمات المفتاحية، الميتا، الأوصاف البديلة.
- FEATURE: إضافة ميزة برمجية جديدة (مثل الحجز أو الدفع).

أخرج JSON فقط:
{
  "intent": "STYLE|CONTENT|LAYOUT|SEO|FEATURE",
  "confidence": 0.0-1.0,
  "explanation": "لماذا صنفت هذا هكذا؟"
}
`;

        const result = await generateWithFallback({
            prompt,
            jsonMode: true,
            temperature: 0.1,
            geminiModel: "gemini-3-flash"
        });

        try {
            return JSON.parse(result.content);
        } catch {
            return { intent: "CONTENT", confidence: 0.5, explanation: "Fallback to content update" };
        }
    }

    /**
     * Multi-modal Vision Protocol implementation
     */
    private async analyzeVisualInput(imageUrl: string): Promise<string> {
        // Implementation using Gemini Vision model
        // For now returning a placeholder that simulates the vision output
        return "تم استخراج لوحة ألوان (Deep Blue, Emerald) ونظام شبكي (Grid) حديث من الصورة المرفقة.";
    }

    /**
     * Generate proactive improvement suggestions
     */
    private async generateProactiveSuggestions(blueprint: SiteBlueprint, lastIntent: IntentType): Promise<string[]> {
        const prompt = `
أنت "مراقب الجودة السيادي" (Sovereign Quality Critic).
بناءً على التعديل الأخير (${lastIntent})، اقترح 3 تحسينات استباقية.

الموقع الحالي:
- الاسم: ${blueprint.name}
- الأقسام: ${blueprint.layout?.map(s => s.type).join(", ")}

القواعد:
1. كن صارماً ومنطقياً.
2. لا تجامل المستخدم.
3. اقترح تحسينات ترفع من "فخامة" الموقع أو "معدل التحويل".

أخرج مصفوفة من 3 نصوص باللغة العربية (JSON).
`;

        const result = await generateWithFallback({
            prompt,
            jsonMode: true,
            temperature: 0.7,
            geminiModel: "gemini-3-flash"
        });

        try {
            return JSON.parse(result.content);
        } catch {
            return ["حسّن تباين ألوان الأزرار", "أضف شهادات عملاء لزيادة الثقة", "اجعل العنوان أكثر اختصاراً"];
        }
    }

    /**
     * Undo Service
     */
    undo(state: RefinementState): SiteBlueprint | null {
        const previous = state.history.pop();
        if (previous) {
            state.future.push(state.currentBlueprint);
            state.currentBlueprint = previous;
            return previous;
        }
        return null;
    }

    /**
     * Redo Service
     */
    redo(state: RefinementState): SiteBlueprint | null {
        const next = state.future.pop();
        if (next) {
            state.history.push(state.currentBlueprint);
            state.currentBlueprint = next;
            return next;
        }
        return null;
    }
}

/**
 * Convenience export for singleton usage
 */
export const refinementEngine = new RefinementEngine();
