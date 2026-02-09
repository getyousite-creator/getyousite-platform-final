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

// SOVEREIGN SPECIFIC IMPLEMENTATIONS
const NeuraAgency = dynamic(() => import('./agency/NeuraAgency'));
const OmegaAgencyPro = dynamic(() => import('./agency/OmegaAgencyPro'));
const LuxeCart = dynamic(() => import('./ecommerce/LuxeCart'));
const AlphaStorePro = dynamic(() => import('./ecommerce/AlphaStorePro'));
const EliteLMS = dynamic(() => import('./education/EliteLMS'));
const TechGrid = dynamic(() => import('./fintech/TechGrid'));
const DrKhalilDental = dynamic(() => import('./healthcare/DrKhalilDental'));
const VitalCare = dynamic(() => import('./healthcare/VitalCare'));
const VermaHospitality = dynamic(() => import('./hospitality/VermaHospitality'));
const SierraIndustrial = dynamic(() => import('./industrial/SierraIndustrial'));
const LawSilo = dynamic(() => import('./legal/LawSilo'));
const BorealEstates = dynamic(() => import('./realestate/BorealEstates'));
const ZenKitchen = dynamic(() => import('./restaurant/ZenKitchen'));

import { SovereignTemplateProps } from "@/lib/types/template";

const templateMap: Record<string, React.ComponentType<SovereignTemplateProps>> = {
    // MEDICAL PILLAR
    'vital-care': VitalCare,
    'dr-khalil': DrKhalilDental,
    'medical-pro': MasterMedical, // Fallback

    // RETAIL PILLAR
    'luxe-cart': LuxeCart,
    'alpha-pro': AlphaStorePro,
    'fashion-store': MasterRetail,
    'urban-retail': MasterRetail,

    // PROFESSIONAL PILLAR
    'law-silo': LawSilo,
    'sierra-industry': SierraIndustrial,
    'omega-pro': OmegaAgencyPro,
    'prime-law': MasterProfessional,
    'prime-partners': MasterProfessional,

    // RESTO PILLAR
    'zen-food': ZenKitchen,
    'verma-hospitality': VermaHospitality,
    'gourmet-engine': MasterResto,
    'fusion-bistro': MasterResto,

    // CREATIVE PILLAR
    'creative-agency': NeuraAgency,
    'cyber-portfolio': MasterCreative, // Mapped to MasterCreative by default, but should ideally point to CyberPortfolio if implemented
    'python-portfolio': PythonPortfolio,
    'studio-zero': MasterCreative,
    'yoga-flow': MasterCreative,

    // LANDING PILLAR
    'tech-grid': TechGrid,
    'saas-convert': MasterLanding,
    'lead-gen-pro': MasterLanding,
    'tech-nova': MasterLanding,
    'venture-cap': MasterLanding,

    // REAL ESTATE PILLAR
    'boreal-estate': BorealEstates,
    'property-hub': MasterRealEstate,
    'estate-pro': MasterRealEstate,
    'estate-prime': MasterRealEstate,

    // LMS PILLAR
    'elite-lms': EliteLMS,
    'course-master': MasterLMS,
    'academy-pro': MasterLMS,
    'lms-pro': MasterLMS,

    // PUBLIC PILLAR
    'news-silo': MasterPublic,
    'blog-pro': MasterPublic,
    'dispatch-engine': MasterPublic,
    'news-daily': MasterPublic,

    // WELLNESS PILLAR
    'spa-wellness': MasterWellness,
    'beauty-glow': MasterWellness,
    'zen-retreat': MasterWellness,
    'dental-plus': MasterWellness,

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
