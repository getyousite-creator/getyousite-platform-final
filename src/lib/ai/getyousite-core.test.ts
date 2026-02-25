import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SovereignEngine } from './getyousite-core';
import { generateWithFallback } from '@/lib/ai/multi-provider';

// Mock the multi-provider to avoid external API calls during unit tests
vi.mock('@/lib/ai/multi-provider', () => ({
    generateWithFallback: vi.fn(),
}));

describe('SovereignEngine - Digital Immunity Check', () => {
    let engine: SovereignEngine;

    beforeEach(() => {
        engine = new SovereignEngine();
        vi.clearAllMocks();
    });

    it('should analyze prompt and return strategic context', async () => {
        const mockResponse = {
            content: JSON.stringify({
                visualIdentity: { primaryColor: '#00D09C' },
                sector: 'tech'
            }),
            provider: 'test-provider',
            model: 'test-model'
        };

        (generateWithFallback as any).mockResolvedValue(mockResponse);

        const context = await engine.analyzePrompt('Test prompt', 'ar');

        expect(context.sector).toBe('tech');
        expect(context.culturalContext?.direction).toBe('rtl');
        expect(generateWithFallback).toHaveBeenCalled();
    });

    it('should generate a valid site schema', async () => {
        const mockSchema = {
            siteMap: { pages: [], navigation: { primary: [] } },
            theme: { colors: {}, typography: {}, direction: 'rtl' }
        };

        (generateWithFallback as any).mockResolvedValue({
            content: JSON.stringify(mockSchema)
        });

        const context: any = { culturalContext: { locale: 'ar', direction: 'rtl' } };
        const schema = await engine.generateSchema(context);

        expect(schema.theme.direction).toBe('rtl');
    });

    it('should fail gracefully on invalid JSON synthesis', async () => {
        (generateWithFallback as any).mockResolvedValue({
            content: 'INVALID_JSON'
        });

        const context: any = { culturalContext: { locale: 'en' } };
        const schema: any = {};

        await expect(engine.buildCode(schema, context)).rejects.toThrow();
    });
});
