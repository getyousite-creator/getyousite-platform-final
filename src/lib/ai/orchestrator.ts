import { SiteBlueprint } from '@/lib/schemas';

/**
 * Sovereign AI Orchestrator
 * يطبق الأوامر الـ 20 من خلال إدارة دورة حياة الموقع من الوصف إلى الكود
 */
export class AIOrchestrator {
  /**
   * المرحلة المدمجة: التوليد الكامل (الأمر رقم 5 و 6 و 7)
   * يجمع بين التحليل، التخطيط، وتوليد المحتوى في تدفق واحد سيادي عبر Abqari Engine
   */
  static async generateCompleteSite(data: { brandName: string, description: string, goal: string, style: string }, locale: string = 'ar'): Promise<SiteBlueprint> {
    const { generateCompleteWebsite } = await import('./multi-provider');

    console.log(`[Orchestrator] Initiating Abqari Synthesis for: ${data.brandName}`);

    const blueprint = await generateCompleteWebsite({
      businessName: data.brandName,
      niche: data.description,
      vision: `Goal: ${data.goal}. Style: ${data.style}. Business Description: ${data.description}`,
      locale: locale,
    });

    return blueprint;
  }
}
