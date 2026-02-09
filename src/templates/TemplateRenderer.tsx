"use client";

import dynamic from 'next/dynamic';
import { useTemplateEditor } from '@/hooks/use-template-editor';

const MasterMedical = dynamic(() => import('./MasterMedical'));
const MasterRetail = dynamic(() => import('./MasterRetail'));
const MasterProfessional = dynamic(() => import('./MasterProfessional'));
const MasterResto = dynamic(() => import('./MasterResto'));
const MasterCreative = dynamic(() => import('./MasterCreative'));
const PythonPortfolio = dynamic(() => import('./creative/PythonPortfolio'));
const MasterLanding = dynamic(() => import('./MasterLanding'));
const MasterRealEstate = dynamic(() => import('./MasterRealEstate'));
const MasterLMS = dynamic(() => import('./MasterLMS'));
const MasterPublic = dynamic(() => import('./MasterPublic'));
const MasterWellness = dynamic(() => import('./MasterWellness'));
const MasterFitness = dynamic(() => import('./MasterFitness'));
const MasterCorporate = dynamic(() => import('./MasterCorporate'));
const MasterAccounting = dynamic(() => import('./MasterAccounting'));
const MasterInternal = dynamic(() => import('./MasterInternal'));

import { SovereignTemplateProps } from "@/lib/types/template";

const templateMap: Record<string, React.ComponentType<SovereignTemplateProps>> = {
    // MEDICAL PILLAR
    'vital-care': MasterMedical,
    'dr-khalil': MasterMedical,
    'medical-pro': MasterMedical,

    // RETAIL PILLAR
    'luxe-cart': MasterRetail,
    'alpha-pro': MasterRetail,
    'fashion-store': MasterRetail,
    'urban-retail': MasterRetail, // Fixed: Added mapping

    // PROFESSIONAL PILLAR
    'law-silo': MasterProfessional,
    'sierra-industry': MasterProfessional,
    'omega-pro': MasterProfessional,
    'prime-law': MasterProfessional, // Fixed: Added mapping
    'prime-partners': MasterProfessional, // Fixed: Added mapping

    // RESTO PILLAR
    'zen-food': MasterResto,
    'verma-hospitality': MasterResto,
    'gourmet-engine': MasterResto,
    'fusion-bistro': MasterResto, // Fixed: Added mapping

    // CREATIVE PILLAR
    'creative-agency': MasterCreative,
    'cyber-portfolio': MasterCreative, // Mapped to MasterCreative by default, but should ideally point to CyberPortfolio if implemented
    'python-portfolio': PythonPortfolio,
    'studio-zero': MasterCreative,
    'yoga-flow': MasterCreative, // Fixed: Mapped to Creative (Visual)

    // LANDING PILLAR
    'tech-grid': MasterLanding,
    'saas-convert': MasterLanding,
    'lead-gen-pro': MasterLanding,
    'tech-nova': MasterLanding, // Fixed: Added mapping
    'venture-cap': MasterLanding, // Fixed: Mapped to Landing (High Conv)

    // REAL ESTATE PILLAR
    'boreal-estate': MasterRealEstate,
    'property-hub': MasterRealEstate,
    'estate-pro': MasterRealEstate,
    'estate-prime': MasterRealEstate, // Fixed: Added mapping

    // LMS PILLAR
    'elite-lms': MasterLMS,
    'course-master': MasterLMS,
    'academy-pro': MasterLMS,
    'lms-pro': MasterLMS, // Fixed: Added mapping

    // PUBLIC PILLAR
    'news-silo': MasterPublic,
    'blog-pro': MasterPublic,
    'dispatch-engine': MasterPublic,
    'news-daily': MasterPublic, // Fixed: Added mapping

    // WELLNESS PILLAR
    'spa-wellness': MasterWellness,
    'beauty-glow': MasterWellness,
    'zen-retreat': MasterWellness,
    'dental-plus': MasterWellness, // Fixed: Mapped to Wellness (Clean)

    // FITNESS PILLAR
    'fitness-neon': MasterFitness,
    'gym-core': MasterFitness,
    'kinetic-lab': MasterFitness,

    // CORPORATE PILLAR
    'corp-global': MasterCorporate,
    'stable-firm': MasterCorporate,
    'market-alpha': MasterCorporate,

    // FINANCIAL PILLAR
    'financial-core': MasterAccounting,
    'tax-logic': MasterAccounting,
    'ledger-pro': MasterAccounting,

    // INTERNAL PILLAR
    'internal-engine': MasterInternal,
    'admin-shell': MasterInternal,
    'data-nexus': MasterInternal,
};

export default function TemplateRenderer({ templateId, blueprint: overrideBlueprint }: { templateId: string, blueprint?: any }) {
    const Template = templateMap[templateId as keyof typeof templateMap] || MasterProfessional;

    const editorSettings = useTemplateEditor(state => state.settings);
    const editorBlueprint = useTemplateEditor(state => state.blueprint);

    // If overrideBlueprint is provided (from the renderer), use it. Otherwise use editor state.
    const activeBlueprint = overrideBlueprint || editorBlueprint;

    // Sovereign Update: Inject full architecture metadata
    return <Template settings={editorSettings} blueprint={activeBlueprint} />;
}
