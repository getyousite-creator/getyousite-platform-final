import { SiteBlueprint } from "@/lib/schemas";

export interface TemplateState {
    primaryColor: string;
    secondaryColor: string;
    headline: string;
    subheadline: string;
    accentColor: string;
    fontFamily: string;
}

export interface SovereignTemplateProps {
    settings: TemplateState;
    blueprint?: SiteBlueprint | null;
    meta?: { id: string; name: string };
}
