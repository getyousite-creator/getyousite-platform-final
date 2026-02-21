"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SiteBlueprintSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Layout, Database, Palette, Globe } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { debounce } from "lodash";
import { SubscriptionGate } from "@/components/auth/SubscriptionGate";
import { useTranslations } from "next-intl";

type SiteFormData = z.infer<typeof SiteBlueprintSchema>;

interface StoreData {
    id: string;
    name: string;
    settings: {
        blueprint: SiteFormData;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export default function SiteEditorPage() {
    const params = useParams();
    const siteId = params.siteId as string;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [storeData, setStoreData] = useState<StoreData | null>(null);
    const supabase = createClient();
    const t = useTranslations("Editor");
    const tc = useTranslations("Common");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { isDirty },
    } = useForm<SiteFormData>({
        resolver: zodResolver(SiteBlueprintSchema) as any, // 
    });

    // Fetch store data
    useEffect(() => {
        const fetchStore = async () => {
            const { data, error } = await supabase
                .from("stores")
                .select("*")
                .eq("id", siteId)
                .single();

            if (error || !data) {
                toast.error(tc("error") + ": Store data could not be retrieved.");
                return;
            }

            setStoreData(data as StoreData);
            reset(data.settings?.blueprint || {});
            setLoading(false);
        };
        fetchStore();
    }, [siteId, reset, supabase]);

    // Auto-save logic (Debounced)
    const saveToSupabase = useCallback(
        (data: SiteFormData) => {
            const debouncedSave = debounce(async (formData: SiteFormData) => {
                if (!storeData) return;

                setSaving(true);
                const { error } = await supabase
                    .from("stores")
                    .update({
                        settings: {
                            ...storeData.settings,
                            blueprint: formData,
                        },
                    })
                    .eq("id", siteId);

                if (error) {
                    toast.error(tc("error") + ": Changes not persisted.");
                } else {
                    toast.success(t("secured"));
                }
                setSaving(false);
            }, 2000);

            debouncedSave(data);
        },
        [siteId, supabase, storeData],
    );

    // Watch for changes to trigger auto-save
    useEffect(() => {
        const subscription = watch((value) => { // eslint-disable-line react-hooks/incompatible-library
            if (isDirty) {
                saveToSupabase(value as SiteFormData);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, isDirty, saveToSupabase]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#080808]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <Layout className="w-5 h-5 text-blue-500" />
                    <h1 className="text-[11px] font-black uppercase tracking-[0.3em]">
                        {t("title")} <span className="text-zinc-500 ml-2">/</span>{" "}
                        <span className="text-blue-400 ml-2">{storeData?.name}</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${saving ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                            {saving ? t("syncing") : t("secured")}
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        className="rounded-full px-8 py-5 bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-all h-auto"
                    >
                        {t("publish")}
                    </Button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto p-10">
                <SubscriptionGate>
                    <Tabs defaultValue="basics" className="w-full">
                        <TabsList className="bg-white/5 border border-white/5 p-1 rounded-xl mb-10">
                            <TabsTrigger
                                value="basics"
                                className="gap-2 text-[9px] font-black uppercase tracking-widest px-6 py-3 data-[state=active]:bg-white/10"
                            >
                                <Database className="w-3.5 h-3.5" />
                                {t("basics")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="content"
                                className="gap-2 text-[9px] font-black uppercase tracking-widest px-6 py-3 data-[state=active]:bg-white/10"
                            >
                                <Layout className="w-3.5 h-3.5" />
                                {t("content")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="design"
                                className="gap-2 text-[9px] font-black uppercase tracking-widest px-6 py-3 data-[state=active]:bg-white/10"
                            >
                                <Palette className="w-3.5 h-3.5" />
                                {t("design")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="domain"
                                className="gap-2 text-[9px] font-black uppercase tracking-widest px-6 py-3 data-[state=active]:bg-white/10"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                {t("domain")}
                            </TabsTrigger>
                        </TabsList>

                        <form
                            onSubmit={handleSubmit((d: SiteFormData) => saveToSupabase(d)) as any} // 
                        >
                            <TabsContent
                                value="basics"
                                className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
                            >
                                <div className="grid gap-8 p-10 rounded-[32px] bg-white/[0.02] border border-white/5">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("siteTitle")}
                                        </Label>
                                        <Input
                                            {...register("name")}
                                            className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("logoText")}
                                        </Label>
                                        <Input
                                            {...register("navigation.logo")}
                                            className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm placeholder:text-zinc-800"
                                            placeholder="Enter Logo Identity"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/5">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                                {t("estimatedSavings")}
                                            </Label>
                                            <Input
                                                {...register("economic_impact.estimated_savings")}
                                                className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                                {t("valuation")}
                                            </Label>
                                            <Input
                                                type="number"
                                                {...register("economic_impact.valuation", { valueAsNumber: true })}
                                                className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div className="space-y-0.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-widest text-white">
                                                {t("whiteLabel")}
                                            </Label>
                                            <p className="text-[9px] text-zinc-500 uppercase font-black">
                                                Remove GetYouSite branding from production
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            {...register("whiteLabel")}
                                            className="w-10 h-6 rounded-full bg-zinc-800 checked:bg-blue-600 appearance-none transition-all relative cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:translate-x-4 before:transition-transform"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="content" className="space-y-8">
                                <div className="grid gap-8 p-10 rounded-[32px] bg-white/[0.02] border border-white/5">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("aboutDescription")}
                                        </Label>
                                        <textarea
                                            {...register("description")}
                                            className="w-full bg-black/40 border border-white/5 h-32 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("servicesSummary")}
                                        </Label>
                                        <Input
                                            {...register("metadata.services_summary")}
                                            className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                            placeholder="List key services..."
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="design" className="space-y-8">
                                <div className="grid grid-cols-2 gap-8 p-10 rounded-[32px] bg-white/[0.02] border border-white/5">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("primaryColor")}
                                        </Label>
                                        <div className="flex gap-4">
                                            <Input
                                                {...register("theme.primary")}
                                                className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                            />
                                            <div
                                                className="w-14 h-14 rounded-2xl border border-white/10"
                                                style={{ backgroundColor: watch("theme.primary") }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("secondaryColor")}
                                        </Label>
                                        <div className="flex gap-4">
                                            <Input
                                                {...register("theme.secondary")}
                                                className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                            />
                                            <div
                                                className="w-14 h-14 rounded-2xl border border-white/10"
                                                style={{ backgroundColor: watch("theme.secondary") }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("accentColor")}
                                        </Label>
                                        <div className="flex gap-4">
                                            <Input
                                                {...register("theme.accent")}
                                                className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                            />
                                            <div
                                                className="w-14 h-14 rounded-2xl border border-white/10"
                                                style={{ backgroundColor: watch("theme.accent") }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("backgroundColor")}
                                        </Label>
                                        <div className="flex gap-4">
                                            <Input
                                                {...register("theme.backgroundColor")}
                                                className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                            />
                                            <div
                                                className="w-14 h-14 rounded-2xl border border-white/10"
                                                style={{ backgroundColor: watch("theme.backgroundColor") }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("textColor")}
                                        </Label>
                                        <div className="flex gap-4">
                                            <Input
                                                {...register("theme.textColor")}
                                                className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                            />
                                            <div
                                                className="w-14 h-14 rounded-2xl border border-white/10"
                                                style={{ backgroundColor: watch("theme.textColor") }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("visualMode")}
                                        </Label>
                                        <select
                                            {...register("theme.mode")}
                                            className="w-full bg-black/40 border border-white/5 h-14 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                                        >
                                            <option value="light">{t("modes.light")}</option>
                                            <option value="dark">{t("modes.dark")}</option>
                                            <option value="industrial">{t("modes.industrial")}</option>
                                            <option value="quantum">{t("modes.quantum")}</option>
                                            <option value="medical">{t("modes.medical")}</option>
                                            <option value="luxury">{t("modes.luxury")}</option>
                                            <option value="clean">{t("modes.clean")}</option>
                                            <option value="neon">{t("modes.neon")}</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            {t("typography")}
                                        </Label>
                                        <select
                                            {...register("theme.fontFamily")}
                                            className="w-full bg-black/40 border border-white/5 h-14 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                                        >
                                            <option value="Inter">{t("fonts.inter")}</option>
                                            <option value="Outfit">{t("fonts.outfit")}</option>
                                            <option value="Playfair Display">
                                                {t("fonts.playfair")}
                                            </option>
                                            <option value="IBM Plex Sans Arabic">{t("fonts.ibm")}</option>
                                            <option value="Roboto">{t("fonts.roboto")}</option>
                                        </select>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="domain" className="space-y-8">
                                <div className="grid gap-8 p-10 rounded-[32px] bg-white/[0.02] border border-white/5">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            Custom Domain
                                        </Label>
                                        <Input
                                            {...register("metadata.custom_domain")}
                                            className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                            placeholder="e.g. yourbrand.com"
                                        />
                                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-2 font-bold italic">
                                            {watch("metadata.custom_domain")
                                                ? "Status: Awaiting Provisioning"
                                                : "Enter a domain to link your Sovereign Node."}
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>
                        </form>
                    </Tabs>
                </SubscriptionGate>
            </div>
        </div>
    );
}
