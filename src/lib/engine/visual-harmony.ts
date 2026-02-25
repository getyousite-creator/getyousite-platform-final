/**
 * VISUAL HARMONY ENGINE - GYS GLOBAL
 * 
 * Implements architectural color theory and geometric resonance.
 * Ensures that even user-driven modifications stay within the 
 * Sovereign Design System (SDS) boundaries.
 */

export interface ColorPalette {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
}

export class VisualHarmonyEngine {
    /**
     * Synthesizes a mathematically harmonious palette based on a seeds
     */
    static synthesizePalette(primaryHex: string): ColorPalette {
        // Convert to HSL for logical manipulation
        const hsl = this.hexToHsl(primaryHex);

        return {
            primary: primaryHex,
            secondary: this.generateSecondary(hsl),
            background: this.generateBackground(hsl),
            text: this.generateText(hsl),
            accent: this.generateAccent(hsl)
        };
    }

    private static generateSecondary(hsl: [number, number, number]): string {
        // Logic: Complementary or Split-Complementary based on sector
        const [h, s, l] = hsl;
        const newH = (h + 180) % 360;
        return this.hslToHex(newH, s * 0.8, l * 0.4);
    }

    private static generateBackground(hsl: [number, number, number]): string {
        // Logic: Dark mode saturation (Protocol SDS-v2)
        const [h, s, l] = hsl;
        return this.hslToHex(h, Math.min(s, 15), 4); // Deep obsidian base
    }

    private static generateText(hsl: [number, number, number]): string {
        const [, , l] = hsl;
        return l > 70 ? "#020617" : "#F8FAFC";
    }

    private static generateAccent(hsl: [number, number, number]): string {
        const [h, s, l] = hsl;
        // Neon-like accent for engineering feel
        return this.hslToHex((h + 40) % 360, 100, 60);
    }

    // UTILITIES
    private static hexToHsl(hex: string): [number, number, number] {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s;
        const l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }

    private static hslToHex(h: number, s: number, l: number): string {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
}
