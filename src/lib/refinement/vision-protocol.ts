/**
 * Multi-modal Vision Protocol
 * 
 * Analyzes uploaded images (screenshots, inspiration) using Gemini 1.5 Pro Vision
 * to extract color palettes, layout analysis, and Tailwind CSS conversions.
 */

import { generateWithFallback } from "@/lib/ai/multi-provider";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface VisionAnalysisRequest {
    imageUrl: string;
    analysisType: "color-palette" | "layout-analysis" | "full-analysis";
    targetBlueprint?: {
        name: string;
        niche: string;
    };
}

export interface ExtractedColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    css: string;
    tailwindClasses: string;
}

export interface LayoutAnalysis {
    structure: {
        header: boolean;
        hero: boolean;
        features: boolean;
        testimonials: boolean;
        cta: boolean;
        footer: boolean;
    };
    layoutType: "single-column" | "multi-column" | "grid" | "mixed";
    spacing: "compact" | "balanced" | "airy";
    alignment: "left" | "center" | "right" | "justified";
}

export interface TailwindConversion {
    componentType: string;
    className: string;
    styles: Record<string, string>;
    suggestedChanges: string[];
}

export interface VisionAnalysisResult {
    success: boolean;
    colorPalette?: ExtractedColorPalette;
    layoutAnalysis?: LayoutAnalysis;
    tailwindConversion?: TailwindConversion;
    insights: string[];
    recommendations: string[];
    error?: string;
}

// ============================================================================
// VISION ANALYZER
// ============================================================================

export class VisionAnalyzer {
    private readonly model: string;

    constructor(options?: { model?: string }) {
        this.model = options?.model || "gemini-1.5-pro";
    }

    /**
     * Analyze uploaded image
     */
    async analyze(request: VisionAnalysisRequest): Promise<VisionAnalysisResult> {
        console.log("[Vision Analyzer] Analyzing image:", request.imageUrl);

        try {
            // Build analysis prompt based on type
            const prompt = this.buildAnalysisPrompt(request);

            // Call Gemini Vision API
            const result = await generateWithFallback({
                prompt,
                jsonMode: true,
                maxTokens: 4000,
                temperature: 0.3,
                geminiModel: this.model,
            });

            // Parse response
            const analysis = JSON.parse(result.content);

            return {
                success: true,
                colorPalette: analysis.colorPalette,
                layoutAnalysis: analysis.layoutAnalysis,
                tailwindConversion: analysis.tailwindConversion,
                insights: analysis.insights || [],
                recommendations: analysis.recommendations || [],
            };
        } catch (error) {
            console.error("[Vision Analyzer] Analysis failed:", error);

            return {
                success: false,
                insights: [],
                recommendations: [],
                error: error instanceof Error ? error.message : "Analysis failed",
            };
        }
    }

    /**
     * Extract color palette from image
     */
    async extractColorPalette(imageUrl: string): Promise<ExtractedColorPalette | null> {
        const result = await this.analyze({
            imageUrl,
            analysisType: "color-palette",
        });

        return result.colorPalette || null;
    }

    /**
     * Analyze layout structure
     */
    async analyzeLayout(imageUrl: string): Promise<LayoutAnalysis | null> {
        const result = await this.analyze({
            imageUrl,
            analysisType: "layout-analysis",
        });

        return result.layoutAnalysis || null;
    }

    /**
     * Build analysis prompt for Gemini Vision
     */
    private buildAnalysisPrompt(request: VisionAnalysisRequest): string {
        const basePrompt = `
أنت "محلل الرؤية السيادي" (Sovereign Vision Analyst) لمنصة GetYouSite.

مهمتك: تحليل الصورة المقدمة واستخراج المعلومات البصرية بدقة.

`;

        if (request.analysisType === "color-palette" || request.analysisType === "full-analysis") {
            basePrompt + `
**Color Palette Extraction:**

استخرج لوحة الألوان الدقيقة من الصورة:
1. اللون الأساسي (Primary) - اللون السائد
2. اللون الثانوي (Secondary) - اللون الداعم
3. لون التمييز (Accent) - اللون المستخدم للعناصر التفاعلية
4. لون الخلفية (Background)
5. لون النص (Text)

أخرج الألوان بصيغة HEX (#RRGGBB).

`;
        }

        if (request.analysisType === "layout-analysis" || request.analysisType === "full-analysis") {
            basePrompt + `
**Layout Analysis:**

حلل الهيكل البصري للصورة:
1. ما هي الأقسام الموجودة؟ (Header, Hero, Features, Testimonials, CTA, Footer)
2. ما هو نوع التخطيط؟ (single-column, multi-column, grid, mixed)
3. ما هو نمط التباعد؟ (compact, balanced, airy)
4. ما هي المحاذاة؟ (left, center, right, justified)

`;
        }

        if (request.analysisType === "full-analysis") {
            basePrompt + `
**Tailwind CSS Conversion:**

حول العناصر المرئية إلى كود Tailwind CSS:
1. حدد نوع المكون (hero, card, button, etc.)
2. استخرج كلاسات Tailwind المطابقة
3. اقترح تحسينات للتكامل مع موقع المستخدم الحالي

`;
        }

        if (request.targetBlueprint) {
            basePrompt + `
**Target Context:**

الموقع المستهدف:
- الاسم: ${request.targetBlueprint.name}
- القطاع: ${request.targetBlueprint.niche}

اقترح تعديلات لتتوافق الألوان والهيكل مع هوية هذا الموقع.

`;
        }

        basePrompt + `
**Output Format:**

أخرج JSON صارم بهذا الهيكل:
{
  "colorPalette": {
    "primary": "#...",
    "secondary": "#...",
    "accent": "#...",
    "background": "#...",
    "text": "#...",
    "css": "CSS variables string",
    "tailwindClasses": "Tailwind classes string"
  },
  "layoutAnalysis": {
    "structure": {
      "header": true,
      "hero": true,
      "features": true,
      "testimonials": true,
      "cta": true,
      "footer": true
    },
    "layoutType": "single-column|multi-column|grid|mixed",
    "spacing": "compact|balanced|airy",
    "alignment": "left|center|right|justified"
  },
  "tailwindConversion": {
    "componentType": "...",
    "className": "...",
    "styles": {},
    "suggestedChanges": []
  },
  "insights": ["insight 1", "insight 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

أخرج JSON فقط بدون أي نص إضافي.
`;

        return basePrompt;
    }
}

// ============================================================================
// COLOR PALETTE EXTRACTOR (Client-side fallback)
// ============================================================================

export class ClientSideColorExtractor {
    /**
     * Extract dominant colors from image using Canvas API
     * (Fallback when AI is unavailable)
     */
    static async extractFromImage(imageUrl: string): Promise<ExtractedColorPalette | null> {
        try {
            const image = await this.loadImage(imageUrl);
            const colors = this.getDominantColors(image);

            if (colors.length < 5) {
                return null;
            }

            return {
                primary: colors[0],
                secondary: colors[1],
                accent: colors[2],
                background: colors[3],
                text: colors[4],
                css: this.generateCSS(colors),
                tailwindClasses: this.generateTailwindClasses(colors),
            };
        } catch (error) {
            console.error("[Color Extractor] Failed:", error);
            return null;
        }
    }

    /**
     * Load image into canvas
     */
    private static loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    /**
     * Get dominant colors from image
     */
    private static getDominantColors(image: HTMLImageElement, count: number = 5): string[] {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return [];
        }

        // Resize for performance
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(image, 0, 0, 100, 100);

        const imageData = ctx.getImageData(0, 0, 100, 100);
        const colors = this.quantizeColors(imageData.data, count);

        return colors.map((rgb) => this.rgbToHex(rgb));
    }

    /**
     * Quantize colors to find dominant ones
     */
    private static quantizeColors(data: Uint8ClampedArray, count: number): number[][] {
        const colorMap = new Map<string, number>();

        // Count color frequencies
        for (let i = 0; i < data.length; i += 4) {
            // Skip alpha channel and low-saturation pixels
            const r = Math.round(data[i] / 32) * 32;
            const g = Math.round(data[i + 1] / 32) * 32;
            const b = Math.round(data[i + 2] / 32) * 32;

            const key = `${r},${g},${b}`;
            colorMap.set(key, (colorMap.get(key) || 0) + 1);
        }

        // Sort by frequency
        const sorted = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, count);

        return sorted.map(([key]) => key.split(",").map(Number));
    }

    /**
     * Convert RGB to HEX
     */
    private static rgbToHex(rgb: number[]): string {
        const toHex = (n: number) => {
            const hex = Math.max(0, Math.min(255, n)).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
    }

    /**
     * Generate CSS variables
     */
    private static generateCSS(colors: string[]): string {
        return `
:root {
    --color-primary: ${colors[0]};
    --color-secondary: ${colors[1]};
    --color-accent: ${colors[2]};
    --color-background: ${colors[3]};
    --color-text: ${colors[4]};
}`.trim();
    }

    /**
     * Generate Tailwind classes
     */
    private static generateTailwindClasses(colors: string[]): string {
        // Simplified mapping - in production would use proper color names
        return colors.map((c) => `bg-[${c}]`).join(" ");
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    VisionAnalyzer,
    ClientSideColorExtractor,
};
