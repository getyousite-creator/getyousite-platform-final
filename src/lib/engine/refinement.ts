/**
 * Smart Tuning & Refinement Protocol (STRP v1.0)
 * Skeleton implementation to enable incremental wiring without breaking build.
 * - AST-style targeted mutations (currently prop-level patching)
 * - Dual-layer memory (session + history snapshots)
 * - Site-aware conversational engine scaffold
 * - postMessage live-preview channel
 * - Vision hooks (palette/layout extraction) ready for Gemini Vision integration
 * - Proactive critic trigger after N mutations
 */

type ComponentPatch = {
    componentId: string;
    prop: string;
    value: string | number | boolean;
};

export type SiteJSON = Record<string, unknown>;

export interface UserInput {
    text: string;
    payload?: Record<string, unknown>;
}

export interface UpdateResult {
    success: boolean;
    updatedSite: SiteJSON;
    message?: string;
}

const PREVIEW_CHANNEL = "GYS_PREVIEW_CHANNEL";
const CRITIC_THRESHOLD = 3;

/**
 * Lightweight "AST mutation" — operates on JSON blueprint instead of full AST for now.
 * Targeted mutation to avoid full regeneration.
 */
export function applyAstMutation(site: SiteJSON, patch: ComponentPatch): SiteJSON {
    const next = structuredClone(site);
    const sections = (next as any).sections ?? [];
    const idx = sections.findIndex((s: any) => s.id === patch.componentId);
    if (idx >= 0) {
        const section = { ...sections[idx] };
        section.props = { ...(section.props || {}) };
        section.props[patch.prop] = patch.value;
        sections[idx] = section;
        (next as any).sections = sections;
    }
    return next;
}

/**
 * Dual-layer memory: session (recent prompts) + history (snapshots for undo/redo)
 */
export class DualMemory {
    private session: UserInput[] = [];
    private history: SiteJSON[] = [];
    private cursor = -1;

    pushPrompt(input: UserInput) {
        this.session.push(input);
        if (this.session.length > 10) this.session.shift();
    }

    getSessionContext() {
        return [...this.session];
    }

    pushSnapshot(site: SiteJSON) {
        // discard redo tail
        this.history = this.history.slice(0, this.cursor + 1);
        this.history.push(structuredClone(site));
        this.cursor = this.history.length - 1;
    }

    undo(): SiteJSON | null {
        if (this.cursor <= 0) return null;
        this.cursor -= 1;
        return structuredClone(this.history[this.cursor]);
    }

    redo(): SiteJSON | null {
        if (this.cursor >= this.history.length - 1) return null;
        this.cursor += 1;
        return structuredClone(this.history[this.cursor]);
    }
}

/**
 * Conversational refinement engine scaffold
 */
export class ChatRefinementEngine {
    constructor(
        private memory: DualMemory,
        private currentSiteState: SiteJSON,
        private criticCounter = 0,
    ) {}

    async processCommand(input: UserInput): Promise<UpdateResult> {
        this.memory.pushPrompt(input);

        // TODO: integrate real classifier; placeholder intent detection
        const intent: "STYLE" | "CONTENT" | "LAYOUT" | "SEO" = detectIntent(input.text);

        // optimistic update stub: echo current site
        const updated = this.currentSiteState;
        this.memory.pushSnapshot(updated);

        this.criticCounter += 1;
        if (this.criticCounter % CRITIC_THRESHOLD === 0) {
            sendPreviewUpdate({ type: "CRITIC_PROMPT" });
        }

        return { success: true, updatedSite: updated, message: `Intent: ${intent}` };
    }
}

function detectIntent(text: string): "STYLE" | "CONTENT" | "LAYOUT" | "SEO" {
    const lower = text.toLowerCase();
    if (lower.includes("color") || lower.includes("لون") || lower.includes("font")) return "STYLE";
    if (lower.includes("title") || lower.includes("copy") || lower.includes("نص")) return "CONTENT";
    if (lower.includes("section") || lower.includes("layout") || lower.includes("ترتيب")) return "LAYOUT";
    return "SEO";
}

/**
 * Live preview channel using postMessage.
 */
export function sendPreviewUpdate(payload: Record<string, unknown>) {
    if (typeof window === "undefined") return;
    window.postMessage({ channel: PREVIEW_CHANNEL, payload }, "*");
}

export function registerPreviewListener(handler: (payload: any) => void) {
    if (typeof window === "undefined") return;
    const listener = (event: MessageEvent) => {
        if (event.data?.channel === PREVIEW_CHANNEL) handler(event.data.payload);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
}

/**
 * Vision: palette & layout extraction hooks (stub for Gemini 1.5 Pro Vision).
 */
export async function extractPaletteFromImage(file: File): Promise<string[]> {
    // Stub: if GEMINI_VISION key exists, hook here.
    if (process.env.NEXT_PUBLIC_GEMINI_VISION_ENABLED === "true") {
        // TODO: call Gemini 1.5 Pro Vision API with the file (requires backend proxy)
    }
    // Fallback simple dominant palette via client Canvas (lightweight)
    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext("2d");
    if (!ctx) return ["#0f172a", "#1e293b", "#e2e8f0", "#3b82f6"];
    ctx.drawImage(bitmap, 0, 0, 32, 32);
    const data = ctx.getImageData(0, 0, 32, 32).data;
    const buckets: Record<string, number> = {};
    for (let i = 0; i < data.length; i += 4) {
        const key = `${data[i]}-${data[i + 1]}-${data[i + 2]}`;
        buckets[key] = (buckets[key] || 0) + 1;
    }
    const top = Object.entries(buckets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([k]) => {
            const [r, g, b] = k.split("-").map(Number);
            return `rgb(${r}, ${g}, ${b})`;
        });
    return top.length ? top : ["#0f172a", "#1e293b", "#e2e8f0", "#3b82f6"];
}

export async function analyzeLayoutFromImage(file: File): Promise<Record<string, unknown>> {
    if (process.env.NEXT_PUBLIC_GEMINI_VISION_ENABLED === "true") {
        // TODO: invoke Gemini Vision layout analysis
    }
    // simple placeholder: detect orientation
    const bitmap = await createImageBitmap(file);
    const orientation = bitmap.width >= bitmap.height ? "landscape" : "portrait";
    return { layout: "grid", hero: true, sections: 5, orientation };
}

/**
 * Proactive critic suggestions.
 */
export function runProactiveCritic(site: SiteJSON): string[] {
    const suggestions: string[] = [];
    const sections = (site as any).sections ?? [];
    const textLength = JSON.stringify(sections).length;
    if (textLength > 4000) {
        suggestions.push("المحتوى طويل؛ تحويله إلى نقاط مختصرة سيحسن القراءة.");
    }
    const hasCTA = sections.some((s: any) => s.type?.toLowerCase().includes("cta"));
    if (!hasCTA) {
        suggestions.push("لا يوجد زر دعوة للإجراء واضح، أضف CTA عالي التباين.");
    }
    return suggestions;
}
