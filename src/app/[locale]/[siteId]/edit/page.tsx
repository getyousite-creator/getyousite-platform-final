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

type SiteFormData = z.infer<typeof SiteBlueprintSchema>;

interface StoreData {
    id: string;
    name: string;
    settings: {
        blueprint: SiteFormData;
        [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    };
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function SiteEditorPage() {
    const params = useParams();
    const siteId = params.siteId as string;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [storeData, setStoreData] = useState<StoreData | null>(null);
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { isDirty },
    } = useForm<SiteFormData>({
        resolver: zodResolver(SiteBlueprintSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
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
                toast.error("Critical: Store data could not be retrieved.");
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
                    toast.error("Sync Failure: Changes not persisted.");
                } else {
                    toast.success("Sovereign Sync: Changes secured.");
                }
                setSaving(false);
            }, 2000);

            debouncedSave(data);
        },
        [siteId, supabase, storeData],
    );

    // Watch for changes to trigger auto-save
    useEffect(() => {
        const subscription = watch((value) => {
            // eslint-disable-line react-hooks/incompatible-library
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
                        Site Engine <span className="text-zinc-500 ml-2">/</span>{" "}
                        <span className="text-blue-400 ml-2">{storeData?.name}</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                        {saving ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Syncing...
                            </>
                        ) : (
                            <>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Secured
                            </>
                        )}
                    </div>
                    <Button
                        variant="glow"
                        size="sm"
                        className="h-9 px-6 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                        Publish Site
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
                                Basics
                            </TabsTrigger>
                            <TabsTrigger
                                value="content"
                                className="gap-2 text-[9px] font-black uppercase tracking-widest px-6 py-3 data-[state=active]:bg-white/10"
                            >
                                <Layout className="w-3.5 h-3.5" />
                                Content
                            </TabsTrigger>
                            <TabsTrigger
                                value="design"
                                className="gap-2 text-[9px] font-black uppercase tracking-widest px-6 py-3 data-[state=active]:bg-white/10"
                            >
                                <Palette className="w-3.5 h-3.5" />
                                Design
                            </TabsTrigger>
                            <TabsTrigger
                                value="domain"
                                className="gap-2 text-[9px] font-black uppercase tracking-widest px-6 py-3 data-[state=active]:bg-white/10"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                Domain
                            </TabsTrigger>
                        </TabsList>

                        <form
                            onSubmit={handleSubmit((d: SiteFormData) => saveToSupabase(d)) as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                        >
                            <TabsContent
                                value="basics"
                                className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
                            >
                                <div className="grid gap-8 p-10 rounded-[32px] bg-white/[0.02] border border-white/5">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            Site Title
                                        </Label>
                                        <Input
                                            {...register("name")}
                                            className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            Logo Text / URL
                                        </Label>
                                        <Input
                                            {...register("navigation.logo")}
                                            className="bg-black/40 border-white/5 h-14 rounded-2xl text-sm placeholder:text-zinc-800"
                                            placeholder="Enter Logo Identity"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="content" className="space-y-8">
                                <div className="grid gap-8 p-10 rounded-[32px] bg-white/[0.02] border border-white/5">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            About Us Description
                                        </Label>
                                        <textarea
                                            {...register("description")}
                                            className="w-full bg-black/40 border border-white/5 h-32 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                            Services Summary
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
                                            Primary Color
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
                                            Typography (Font)
                                        </Label>
                                        <select
                                            {...register("theme.fontFamily")}
                                            className="w-full bg-black/40 border border-white/5 h-14 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                                        >
                                            <option value="Inter">Inter (Industrial)</option>
                                            <option value="Outfit">Outfit (Modern)</option>
                                            <option value="Playfair Display">
                                                Playfair (Prestige)
                                            </option>
                                            <option value="Roboto">Roboto (Technical)</option>
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
