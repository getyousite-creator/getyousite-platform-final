"use client";

import dynamic from 'next/dynamic';
import { useTemplateEditor } from '@/hooks/use-template-editor';

const MasterMedical = dynamic<SovereignTemplateProps>(() => import('./MasterMedical'));
const MasterRetail = dynamic<SovereignTemplateProps>(() => import('./MasterRetail'));
const MasterProfessional = dynamic<SovereignTemplateProps>(() => import('./MasterProfessional'));
const MasterResto = dynamic<SovereignTemplateProps>(() => import('./MasterResto'));
const MasterCreative = dynamic<SovereignTemplateProps>(() => import('./MasterCreative'));
const PythonPortfolio = dynamic<SovereignTemplateProps>(() => import('./creative/PythonPortfolio'));
const MasterLanding = dynamic<SovereignTemplateProps>(() => import('./MasterLanding'));
const MasterRealEstate = dynamic<SovereignTemplateProps>(() => import('./MasterRealEstate'));
const MasterLMS = dynamic<SovereignTemplateProps>(() => import('./MasterLMS'));
const MasterPublic = dynamic<SovereignTemplateProps>(() => import('./MasterPublic'));
const MasterWellness = dynamic<SovereignTemplateProps>(() => import('./MasterWellness'));
const MasterFitness = dynamic<SovereignTemplateProps>(() => import('./MasterFitness'));
const MasterCorporate = dynamic<SovereignTemplateProps>(() => import('./MasterCorporate'));

const MasterAccounting = dynamic<SovereignTemplateProps>(() => import('./MasterAccounting'));
const MasterInternal = dynamic<SovereignTemplateProps>(() => import('./MasterInternal'));

// SOVEREIGN SPECIFIC IMPLEMENTATIONS
const NeuraAgency = dynamic<SovereignTemplateProps>(() => import('./agency/NeuraAgency'));
const OmegaAgencyPro = dynamic<SovereignTemplateProps>(() => import('./agency/OmegaAgencyPro'));
const LuxeCart = dynamic<SovereignTemplateProps>(() => import('./ecommerce/LuxeCart'));
const AlphaStorePro = dynamic<SovereignTemplateProps>(() => import('./ecommerce/AlphaStorePro'));
const EliteLMS = dynamic<SovereignTemplateProps>(() => import('./education/EliteLMS'));
const TechGrid = dynamic<SovereignTemplateProps>(() => import('./fintech/TechGrid'));
const DrKhalilDental = dynamic<SovereignTemplateProps>(() => import('./healthcare/DrKhalilDental'));
const VitalCare = dynamic<SovereignTemplateProps>(() => import('./healthcare/VitalCare'));
const VermaHospitality = dynamic<SovereignTemplateProps>(() => import('./hospitality/VermaHospitality'));
const SierraIndustrial = dynamic<SovereignTemplateProps>(() => import('./industrial/SierraIndustrial'));
const LawSilo = dynamic<SovereignTemplateProps>(() => import('./legal/LawSilo'));
const BorealEstates = dynamic<SovereignTemplateProps>(() => import('./realestate/BorealEstates'));
const ZenKitchen = dynamic<SovereignTemplateProps>(() => import('./restaurant/ZenKitchen'));

import { SovereignTemplateProps } from "@/lib/types/template";

const AtomicRenderer = dynamic<any>(() => import('./AtomicRenderer'));

const templateMap: Record<string, React.ComponentType<any>> = {
    'atomic-quantum': AtomicRenderer, // THE NEW ENGINE
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

export default function TemplateRenderer({
    templateId,
    blueprint: overrideBlueprint,
    meta,
    selectedPageSlug
}: {

    templateId: string,
    blueprint?: any,
    meta?: { id: string; name: string },
    selectedPageSlug?: string

}) {
    const editorSettings = useTemplateEditor(state => state.settings);
    const editorBlueprint = useTemplateEditor(state => state.blueprint);

    // If overrideBlueprint is provided (from the renderer), use it. Otherwise use editor state.
    const activeBlueprint = overrideBlueprint || editorBlueprint;

    // PROTOCOL 5 INTEGRATION:
    // If templateId is 'atomic-quantum' OR if we want to force atomic rendering for new builds or missing mappings.
    if (templateId === 'atomic-quantum' || !templateMap[templateId]) {
        return <AtomicRenderer blueprint={activeBlueprint} meta={meta} selectedPageSlug={selectedPageSlug} />;
    }


    const Template = templateMap[templateId] || AtomicRenderer;

    // Sovereign Update: Inject full architecture metadata
    return <Template settings={editorSettings} blueprint={activeBlueprint} meta={meta} selectedPageSlug={selectedPageSlug} />;

}


