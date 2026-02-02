"use client";

import dynamic from 'next/dynamic';
import { useTemplateEditor } from '@/hooks/use-template-editor';

const NeuraAgency = dynamic(() => import('./agency/NeuraAgency'), { ssr: false });
const SierraIndustrial = dynamic(() => import('./industrial/SierraIndustrial'), { ssr: false });
const VitalCare = dynamic(() => import('./healthcare/VitalCare'), { ssr: false });
const LuxeCart = dynamic(() => import('./ecommerce/LuxeCart'), { ssr: false });
const LawSilo = dynamic(() => import('./legal/LawSilo'), { ssr: false });
const EliteLMS = dynamic(() => import('./education/EliteLMS'), { ssr: false });
const ZenKitchen = dynamic(() => import('./restaurant/ZenKitchen'), { ssr: false });
const BorealEstates = dynamic(() => import('./realestate/BorealEstates'), { ssr: false });
const CyberPortfolio = dynamic(() => import('./creative/CyberPortfolio'), { ssr: false });
const TechGrid = dynamic(() => import('./fintech/TechGrid'), { ssr: false });
const VermaHospitality = dynamic(() => import('./hospitality/VermaHospitality'), { ssr: false });
const OmegaAgencyPro = dynamic(() => import('./agency/OmegaAgencyPro'), { ssr: false });
const AlphaStorePro = dynamic(() => import('./ecommerce/AlphaStorePro'), { ssr: false });

const templateMap = {
    'creative-agency': NeuraAgency,
    'sierra-industry': SierraIndustrial,
    'vital-care': VitalCare,
    'luxe-cart': LuxeCart,
    'law-silo': LawSilo,
    'elite-lms': EliteLMS,
    'zen-food': ZenKitchen,
    'boreal-estate': BorealEstates,
    'cyber-portfolio': CyberPortfolio,
    'tech-grid': TechGrid,
    'verma-hospitality': VermaHospitality,
    'omega-pro': OmegaAgencyPro,
    'alpha-pro': AlphaStorePro,
};

export default function TemplateRenderer({ templateId }: { templateId: string }) {
    const Template = templateMap[templateId as keyof typeof templateMap];

    if (!Template) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-500 italic">
                Architecture deployment in progress...
            </div>
        );
    }

    // Pro models handle their own wrapping already. 
    // Legacy models will be refactored one by one.
    return <Template settings={useTemplateEditor.getState().settings} />;
}
