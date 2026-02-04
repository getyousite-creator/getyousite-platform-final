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
const DrKhalilDental = dynamic(() => import('./healthcare/DrKhalilDental'), { ssr: false });

import { SovereignTemplateProps } from "@/lib/types/template";

const templateMap: Record<string, React.ComponentType<SovereignTemplateProps>> = {
    'creative-agency': NeuraAgency as any, // Temporary cast until strict refactor is complete for all
    'sierra-industry': SierraIndustrial as any,
    'vital-care': VitalCare as any,
    'luxe-cart': LuxeCart as any,
    'law-silo': LawSilo as any,
    'elite-lms': EliteLMS as any,
    'zen-food': ZenKitchen as any,
    'boreal-estate': BorealEstates as any,
    'cyber-portfolio': CyberPortfolio as any,
    'tech-grid': TechGrid as any,
    'verma-hospitality': VermaHospitality as any,
    'omega-pro': OmegaAgencyPro as any,
    'alpha-pro': AlphaStorePro as any,
    'dr-khalil': DrKhalilDental as any,
};

export default function TemplateRenderer({ templateId }: { templateId: string }) {
    const Template = templateMap[templateId as keyof typeof templateMap];

    // Sovereign Update: Subscribe to store changes to ensure real-time preview (Optimistic UI)
    const settings = useTemplateEditor(state => state.settings);
    const blueprint = useTemplateEditor(state => state.blueprint);

    if (!Template) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-500 italic">
                Architecture deployment in progress...
            </div>
        );
    }

    // Sovereign Update: Inject full blueprint schema
    return <Template settings={settings} blueprint={blueprint} />;
}
