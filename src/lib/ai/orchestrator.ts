import { SiteBlueprint } from '@/lib/schemas';
import { generateSiteWithCoT } from './getyousite-core';
import { refinementEngine, RefinementState, STRPUpdateResult } from './refinement-engine';

/**
 * Sovereign Engineering Orchestrator
 * يطبق البروتوكول السيادي من خلال إدارة دورة حياة الموقع من الوصف إلى الكود
 */
export class SovereignOrchestrator {
  /**
   * المرحلة المدمجة: التوليد السيادي الكامل (Phases 1-3)
   * يطبق بروتوكول: التحليل -> التخطيط -> التوليد
   */
  static async generateCompleteSite(data: { brandName: string, description: string, goal: string, style: string }, locale: string = 'ar'): Promise<SiteBlueprint> {
    console.log(`[Orchestrator] Initiating Sovereign Synthesis for: ${data.brandName}`);

    const prompt = `Brand: ${data.brandName}. Description: ${data.description}. Goal: ${data.goal}. Style: ${data.style}.`;
    const result = await generateSiteWithCoT(prompt, locale);

    return result.blueprint;
  }

  /**
   * Conversational Refinement (STRP v1.0)
   * يطبق بروتوكول الضبط والتحسين الذكي عبر الحوار
   */
  static async refineSiteConversationally(command: string, state: RefinementState): Promise<STRPUpdateResult> {
    console.log(`[Orchestrator] Initiating STRP Refinement: ${command}`);
    const result = await refinementEngine.processRefinement(command, state);
    return result;
  }

  /**
   * Partial Update — routes through full CoT generation to maintain blueprint integrity
   */
  static async updateSitePartially(blueprint: SiteBlueprint, command: string, locale: string = 'ar'): Promise<SiteBlueprint> {
    console.log(`[Orchestrator] Initiating Partial Update: ${command}`);
    const prompt = `UPDATE EXISTING SITE. Command: ${command}. Summary: ${JSON.stringify(blueprint).slice(0, 500)}`;
    const result = await generateSiteWithCoT(prompt, locale);
    return result.blueprint;
  }
}
