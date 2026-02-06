"use client";

import dynamic from 'next/dynamic';
import { useTemplateEditor } from '@/hooks/use-template-editor';

const MasterMedical = dynamic(() => import('./MasterMedical'), { ssr: false });
const MasterRetail = dynamic(() => import('./MasterRetail'), { ssr: false });
const MasterProfessional = dynamic(() => import('./MasterProfessional'), { ssr: false });
const MasterResto = dynamic(() => import('./MasterResto'), { ssr: false });
const MasterCreative = dynamic(() => import('./MasterCreative'), { ssr: false });
const MasterLanding = dynamic(() => import('./MasterLanding'), { ssr: false });
const MasterRealEstate = dynamic(() => import('./MasterRealEstate'), { ssr: false });
const MasterLMS = dynamic(() => import('./MasterLMS'), { ssr: false });
const MasterPublic = dynamic(() => import('./MasterPublic'), { ssr: false });
const MasterWellness = dynamic(() => import('./MasterWellness'), { ssr: false });
const MasterFitness = dynamic(() => import('./MasterFitness'), { ssr: false });
const MasterCorporate = dynamic(() => import('./MasterCorporate'), { ssr: false });
const MasterAccounting = dynamic(() => import('./MasterAccounting'), { ssr: false });
const MasterInternal = dynamic(() => import('./MasterInternal'), { ssr: false });

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

    // PROFESSIONAL PILLAR
    'law-silo': MasterProfessional,
    'sierra-industry': MasterProfessional,
    'omega-pro': MasterProfessional,

    // RESTO PILLAR
    'zen-food': MasterResto,
    'verma-hospitality': MasterResto,
    'gourmet-engine': MasterResto,

    // CREATIVE PILLAR
    'creative-agency': MasterCreative,
    'cyber-portfolio': MasterCreative,
    'studio-zero': MasterCreative,

    // LANDING PILLAR
    'tech-grid': MasterLanding,
    'saas-convert': MasterLanding,
    'lead-gen-pro': MasterLanding,

    // REAL ESTATE PILLAR
    'boreal-estate': MasterRealEstate,
    'property-hub': MasterRealEstate,
    'estate-pro': MasterRealEstate,

    // LMS PILLAR
    'elite-lms': MasterLMS,
    'course-master': MasterLMS,
    'academy-pro': MasterLMS,

    // PUBLIC PILLAR
    'news-silo': MasterPublic,
    'blog-pro': MasterPublic,
    'dispatch-engine': MasterPublic,

    // WELLNESS PILLAR
    'spa-wellness': MasterWellness,
    'beauty-glow': MasterWellness,
    'zen-retreat': MasterWellness,

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

export default function TemplateRenderer({ templateId }: { templateId: string }) {
    const Template = templateMap[templateId as keyof typeof templateMap] || MasterProfessional;

    const settings = useTemplateEditor(state => state.settings);
    const blueprint = useTemplateEditor(state => state.blueprint);

    // Sovereign Update: Inject full architecture metadata
    return <Template settings={settings} blueprint={blueprint} />;
}
