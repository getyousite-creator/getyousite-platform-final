"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { useAutoSave } from "@/hooks/use-auto-save";
import { CustomizerEngine } from "@/lib/engine/customizer";
import { refineBlueprintAction } from "@/app/actions/ai-actions";
import { ChatRefinementEngine, DualMemory, sendPreviewUpdate } from "@/lib/engine/refinement";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CommandCenter } from "@/components/customizer/CommandCenter";
import { PreviewCanvas } from "@/components/customizer/PreviewCanvas";
import { saveStoreAction, getStoreAction } from "@/app/actions/store-actions";
import { StorageService } from "@/lib/services/storage-service";
import AuthModal from "@/components/auth/AuthModal";
import AICommandBar from "@/components/customizer/AICommandBar";
import AITweakerPanel from "@/components/editor/AITweakerPanel";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Activity, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { toast } from "sonner";
import { applyValidatedCommandPatch } from "@/lib/editor/command-patcher";
import { SiteBlueprint } from "@/lib/schemas";

export default function CustomizerPage() {
    // 1. Hooks & State
    const { onOpen } = useLaunchModal();
    const {
        blueprint,
        updateBlueprint,
        isGenerating,
        setIsGenerating,
        saveStatus,
        undo,
        redo,
        history,
        activeStoreId,
        setActiveStoreId,
    } = useTemplateEditor();

    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const locale = (params.locale as string) || "ar";
    const storeIdParam = searchParams.get("id");

    const [vision, setVision] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [niche, setNiche] = useState("AI & Tech");
    const [selectedId, setSelectedId] = useState("t1-quantum");
    const [selectedPageSlug, setSelectedPageSlug] = useState("index");
    const [isLoadingStore, setIsLoadingStore] = useState(false);
    const [userId, setUserId] = useState<string>("");
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [flashSuccess, setFlashSuccess] = useState(false);
    const [flashError, setFlashError] = useState(false);

    const visionParam = searchParams.get("vision");

    // STRP: dual memory + refinement engine
    const memoryRef = useRef(new DualMemory());
    const engineRef = useRef<ChatRefinementEngine | null>(null);

    // 4. Save Logic
    const handleSave = useCallback(
        async (generatedBlueprint: SiteBlueprint, options?: { promptOnUnauthorized?: boolean }) => {
            const promptOnUnauthorized = options?.promptOnUnauthorized ?? true;
            try {
                const result = await saveStoreAction(
                    generatedBlueprint,
                    businessName || "My Store",
                    vision,
                    activeStoreId || undefined,
                );

                if (!result.success && result.error?.includes("Unauthorized")) {
                    if (promptOnUnauthorized) {
                        setShowAuthModal(true);
                    }
                    return false;
                } else if (!result.success) {
                    return false;
                }

                if (result.success && result.data?.id && !activeStoreId) {
                    setActiveStoreId(result.data.id);
                    // Update URL without reload to establish edit session
                    router.replace(`?id=${result.data.id}`, { scroll: false });
                }

                return true;
            } catch {
                return false;
            }
        },
        [businessName, vision, activeStoreId, router, setActiveStoreId],
    );

    // 5. Generation Orchestration
    const triggerGeneration = useCallback(async () => {
        if (!vision) return;
        const effectiveBusinessName =
            businessName || vision.split(" ").slice(0, 4).join(" ") || "My Store";

        setIsGenerating(true);
        try {
            const finalBlueprint: SiteBlueprint = await CustomizerEngine.generateFinalBlueprint({
                businessName: effectiveBusinessName,
                niche,
                vision,
                selectedId,
            });

            // Optimistic Update
            updateBlueprint(finalBlueprint);

            // SOVEREIGN PERSISTENCE: Save immediately to DB to prevent data loss
            // If we don't have an activeStoreId, we generate a temporary one and link it to the session
            const saved = await handleSave(finalBlueprint, { promptOnUnauthorized: false });

            if (saved) {
                setFlashSuccess(true);
                setTimeout(() => setFlashSuccess(false), 900);
                // trial: skip payment prompts
            }
        } catch {
            toast.error("Generation failed");
        } finally {
            setIsGenerating(false);
        }
    }, [vision, businessName, niche, selectedId, setIsGenerating, updateBlueprint, handleSave]);

    // 3. Auto-Save Integration
    useAutoSave(activeStoreId);

    // 3. Load Existing Store
    useEffect(() => {
        if (!storeIdParam) return;

        const loadStore = async () => {
            setIsLoadingStore(true);
            const result = await getStoreAction(storeIdParam);

            if (result.success && result.data) {
                setActiveStoreId(result.data.id);
                setUserId(result.data.user_id); // Set User ID for Storage RLS
                setBusinessName(result.data.name);
                setVision(result.data.vision || "");
                if (result.data.blueprint) {
                    updateBlueprint(result.data.blueprint);
                    // Optionally set selectedId if stored in blueprint metadata
                }
            } else {
                toast.error("Failed to load store");
            }
            setIsLoadingStore(false);
        };

        loadStore();
    }, [storeIdParam, updateBlueprint, setActiveStoreId]);

    // 2. Initialize from URL
    useEffect(() => {
        if (visionParam && !vision) {
            const bizName = visionParam.split(" ").slice(0, 3).join(" ");
            setVision(visionParam);
            setBusinessName(bizName);
        }
    }, [visionParam, vision]);

    // STRP: sync refinement engine with latest blueprint snapshots
    useEffect(() => {
        if (blueprint) {
            memoryRef.current.pushSnapshot(blueprint);
            engineRef.current = new ChatRefinementEngine(memoryRef.current, blueprint);
        }
    }, [blueprint]);

    // 2b. Auto-Start Generation Circuit
    useEffect(() => {
        if (vision && !blueprint && !isGenerating && !isLoadingStore) {
            triggerGeneration();
        }
    }, [vision, blueprint, isGenerating, isLoadingStore, triggerGeneration]);

    // 6. Asset Logic
    const handleAssetUpload = useCallback(
        async (url: string) => {
            if (!blueprint) return;

            // Clone and Update Blueprint (Logic: Find hero or relevant section and inject image)
            const updatedBlueprint: SiteBlueprint = { ...blueprint };
            let oldUrl: string | undefined;

            // Strategy: Intelligent Replacement
            // 1. Look for 'hero' section
            const heroSection = updatedBlueprint.layout?.find((s) => s.type === "hero") as
                | SiteBlueprint["layout"][number]
                | undefined;
            if (heroSection && heroSection.content) {
                oldUrl = heroSection.content.image;
                heroSection.content.image = url;
            } else {
                // Fallback: Add metadata
                if (!updatedBlueprint.metadata) updatedBlueprint.metadata = {};
                oldUrl = updatedBlueprint.metadata.heroImage;
                updatedBlueprint.metadata.heroImage = url;
            }

            // Asset Cleanup: Delete old asset if it exists and is from our storage
            if (oldUrl && oldUrl.includes("site-assets") && oldUrl !== url) {
                // We fire and forget the delete to not block UI, or we could await if critical
                // Given the user's strict requirement, we should probably log error if it fails
                StorageService.deleteAsset(oldUrl).then(() => {
                    // Silent fail/success
                });
            }

            updateBlueprint(updatedBlueprint);

            // Debounced Save will kick in via useAutoSave if we trigger an update,
            // OR we can explicitly save here to be safe since assets are external.
            handleSave(updatedBlueprint);
            toast.success("Blueprint Synced with Asset");
        },
        [blueprint, updateBlueprint, handleSave],
    );

    // 7. Auto-Generate for New Sessions
    useEffect(() => {
        if (activeStoreId || isLoadingStore) return;

        const timer = setTimeout(() => {
            if (vision) triggerGeneration();
        }, 1500);
        return () => clearTimeout(timer);
    }, [vision, selectedId, triggerGeneration, activeStoreId, isLoadingStore]);

    // 7. Render
    if (isLoadingStore) {
        return (
            <div className="min-h-screen bg-[#0A2540] flex flex-col items-center justify-center text-white sovereign">
                <Activity className="animate-spin text-[#00D09C] w-12 h-12 mb-6" />
                <span className="font-black text-[10px] uppercase tracking-widest text-zinc-400 animate-pulse">
                    RECONSTRUCTING_STORE_DNA...
                </span>
            </div>
        );
    }

    return (
        <PayPalScriptProvider
            options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                currency: "USD",
                intent: "capture", // capture
            }}
        >
            <div className="min-h-screen bg-[#0A2540] text-white flex flex-col md:flex-row overflow-hidden sovereign">
                {/* LEFT SIDE: COMMAND CENTER */}
                <aside className="w-full md:w-1/3 border-r border-white/5 p-8 overflow-y-auto bg-[#0A2540]/90 backdrop-blur-xl z-20 relative flex flex-col gap-6">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00D09C]/5 to-transparent pointer-events-none" />

                    {/* Status Bar */}
                    <div className="flex items-center justify-between">
                        {activeStoreId ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#051423] border border-white/10">
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            saveStatus === "saving"
                                                ? "bg-yellow-500 animate-pulse"
                                                : saveStatus === "saved"
                                                  ? "bg-[#00D09C]"
                                                  : saveStatus === "error"
                                                    ? "bg-red-500"
                                                    : "bg-gray-600"
                                        }`}
                                    />
                                    <span className="text-[10px] uppercase font-bold text-gray-400">
                                        {saveStatus === "saving"
                                            ? "Syncing..."
                                            : saveStatus === "saved"
                                              ? "Synced"
                                              : saveStatus === "error"
                                                ? "Sync Error"
                                                : "Unsaved"}
                                    </span>
                                </div>
                                <Button
                                    onClick={() =>
                                        onOpen("customizer", {
                                            id: activeStoreId || blueprint?.id || "temp",
                                            name: businessName,
                                        })
                                    }
                                    className="bg-[#00D09C] hover:bg-[#00B085] text-white px-4 h-8 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#00D09C]/20"
                                >
                                    Go Live <Rocket className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                        ) : (
                            <div className="px-3 py-1.5 rounded-full bg-[#00D09C]/10 border border-[#00D09C]/20">
                                <span className="text-[10px] uppercase font-bold text-[#00D09C]">
                                    New Session
                                </span>
                            </div>
                        )}
                    </div>

                    <CommandCenter
                        businessName={businessName}
                        setBusinessName={setBusinessName}
                        vision={vision}
                        setVision={setVision}
                        niche={niche}
                        setNiche={setNiche}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        isGenerating={isGenerating}
                        onGenerate={triggerGeneration}
                        activeStoreId={activeStoreId}
                        userId={userId}
                        onAssetUpload={handleAssetUpload}
                        aiInsight={blueprint?.ai_insight}
                        blueprint={blueprint || null}
                        selectedPageSlug={selectedPageSlug}
                        onSelectPage={setSelectedPageSlug}
                        undo={undo}
                        redo={redo}
                        canUndo={history.past.length > 0}
                        canRedo={history.future.length > 0}
                    />
                </aside>

                {/* RIGHT SIDE: LIVE PREVIEW CANVAS */}
                <main className="flex-1 bg-[#051423] overflow-hidden relative p-8 md:p-12 flex flex-col">
                    {/* Top Bar with AI Command */}
                    <div className="w-full flex justify-center mb-8 relative z-[60]">
                        <AICommandBar
                            isProcessing={isGenerating}
                            flashSuccess={flashSuccess}
                            flashError={flashError}
                            onCommand={async (cmd: string) => {
                                if (!blueprint) return;
                                // Broadcast intent to preview immediately
                                sendPreviewUpdate({ type: "command", command: cmd });

                                const localPatch = applyValidatedCommandPatch(blueprint, cmd);
                                if (localPatch.handled) {
                                    const patchedBlueprint = localPatch.blueprint as SiteBlueprint;
                                    updateBlueprint(patchedBlueprint);
                                    memoryRef.current.pushSnapshot(patchedBlueprint);
                                    sendPreviewUpdate({ type: "blueprint-update", blueprint: patchedBlueprint });
                                    const ok = await handleSave(patchedBlueprint, {
                                        promptOnUnauthorized: false,
                                    });
                                    if (ok) {
                                        setFlashSuccess(true);
                                        setTimeout(() => setFlashSuccess(false), 900);
                                    }
                                    const opCount = Array.isArray(localPatch.operations)
                                        ? localPatch.operations.length
                                        : 0;
                                    toast.success(`Command patch applied (${opCount} ops)`);
                                    return;
                                }

                                // STRP: conversational refinement engine (optimistic / local)
                                if (engineRef.current) {
                                    const result = await engineRef.current.processCommand({ text: cmd });
                                    if (result.updatedSite) {
                                        const refined = result.updatedSite as SiteBlueprint;
                                        updateBlueprint(refined);
                                        memoryRef.current.pushSnapshot(refined);
                                        sendPreviewUpdate({ type: "blueprint-update", blueprint: refined });
                                        const ok = await handleSave(refined, { promptOnUnauthorized: false });
                                        if (ok) {
                                            setFlashSuccess(true);
                                            setTimeout(() => setFlashSuccess(false), 900);
                                        }
                                        toast.success(result.message || "Applied via STRP");
                                        return;
                                    }
                                }

                                // Remote AI refinement fallback
                                setIsGenerating(true);
                                try {
                                    const modifiedBlueprint = await refineBlueprintAction({
                                        currentBlueprint: blueprint,
                                        command: cmd,
                                        businessName: businessName,
                                        niche: niche,
                                        locale: locale || "ar",
                                    });
                                    updateBlueprint(modifiedBlueprint);
                                    memoryRef.current.pushSnapshot(modifiedBlueprint);
                                    sendPreviewUpdate({ type: "blueprint-update", blueprint: modifiedBlueprint });
                                    const ok = await handleSave(modifiedBlueprint, {
                                        promptOnUnauthorized: false,
                                    });
                                    if (ok) {
                                        setFlashSuccess(true);
                                        setTimeout(() => setFlashSuccess(false), 900);
                                    }
                                    toast.success("Blueprint refined by AI");
                                } catch (e) {
                                    console.error(e);
                                    setFlashError(true);
                                    setTimeout(() => setFlashError(false), 900);
                                    toast.error("Refinement failed");
                                } finally {
                                    setIsGenerating(false);
                                }
                            }}
                        />
                    </div>

                    <div className="flex-1 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00D09C]/5 via-transparent to-transparent pointer-events-none" />
                        <PreviewCanvas
                            blueprint={blueprint}
                            isGenerating={isGenerating}
                            selectedPageSlug={selectedPageSlug}
                            onTextChange={async (id, text) => {
                                if (!blueprint) return;
                                const next = structuredClone(blueprint);
                                const pageLayout = next.pages?.[selectedPageSlug]?.layout || next.layout;
                                const target = pageLayout.find((s: any) => s.id === id);
                                if (target) {
                                    // Update first string field or common headline/title keys
                                    if (typeof target.content?.title === "string") target.content.title = text;
                                    else if (typeof target.content?.headline === "string") target.content.headline = text;
                                    else if (typeof target.content?.heading === "string") target.content.heading = text;
                                    else {
                                        const key = Object.keys(target.content || {}).find((k) => typeof target.content[k] === "string");
                                        if (key) target.content[key] = text;
                                    }
                                    updateBlueprint(next);
                                    memoryRef.current.pushSnapshot(next);
                                    sendPreviewUpdate({ type: "blueprint-update", blueprint: next });
                                    const ok = await handleSave(next, { promptOnUnauthorized: false });
                                    if (ok) {
                                        setFlashSuccess(true);
                                        setTimeout(() => setFlashSuccess(false), 900);
                                    } else {
                                        setFlashError(true);
                                        setTimeout(() => setFlashError(false), 900);
                                    }
                                }
                            }}
                            onReorder={async (sourceId, targetId) => {
                                if (!blueprint) return;
                                const next = structuredClone(blueprint);
                                const pageLayout = next.pages?.[selectedPageSlug]?.layout || next.layout;
                                const from = pageLayout.findIndex((s: any) => s.id === sourceId);
                                const to = pageLayout.findIndex((s: any) => s.id === targetId);
                                if (from === -1 || to === -1) return;
                                const [moved] = pageLayout.splice(from, 1);
                                pageLayout.splice(to, 0, moved);
                                if (next.pages?.[selectedPageSlug]) {
                                    next.pages[selectedPageSlug].layout = pageLayout;
                                } else {
                                    next.layout = pageLayout;
                                }
                                updateBlueprint(next);
                                memoryRef.current.pushSnapshot(next);
                                sendPreviewUpdate({ type: "blueprint-update", blueprint: next });
                                const ok = await handleSave(next, { promptOnUnauthorized: false });
                                if (ok) {
                                    setFlashSuccess(true);
                                    setTimeout(() => setFlashSuccess(false), 900);
                                } else {
                                    setFlashError(true);
                                    setTimeout(() => setFlashError(false), 900);
                                }
                            }}
                        />
                    </div>
                </main>
            </div>

            <AITweakerPanel />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </PayPalScriptProvider>
    );
}
