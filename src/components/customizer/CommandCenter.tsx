"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, Zap, Shield, Briefcase, Coffee, Newspaper, Activity, Image as ImageIcon } from "lucide-react";
import { SITE_TEMPLATES } from "@/lib/templates";
import { AssetUploader } from "./AssetUploader";

interface CommandCenterProps {
    businessName: string;
    setBusinessName: (val: string) => void;
    vision: string;
    setVision: (val: string) => void;
    niche: string;
    setNiche: (val: string) => void;
    selectedId: string;
    setSelectedId: (val: string) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    activeStoreId?: string | null;
    userId?: string;
    onAssetUpload?: (url: string) => void;
}

export function CommandCenter({
    businessName,
    setBusinessName,
    vision,
    setVision,
    niche,
    setNiche,
    selectedId,
    setSelectedId,
    isGenerating,
    onGenerate,
    activeStoreId,
    userId,
    onAssetUpload
}: CommandCenterProps) {
    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="px-0 pt-0 pb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/5 px-2 py-0">
                        <Shield className="w-3 h-3 mr-1" />
                        Sovereign_Engine_v1.0
                    </Badge>
                </div>
                <CardTitle className="text-4xl">Architect Your <br /><span className="text-blue-500">Digital Empire</span></CardTitle>
                <CardDescription className="text-zinc-400">Transform vision into architectural logic.</CardDescription>
            </CardHeader>

            <CardContent className="px-0 space-y-8">
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Business_Identity</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Name (e.g. Nexus)"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="bg-white/5 border-white/10 h-14 text-white focus:ring-blue-500/50"
                        />
                        <Select value={niche} onValueChange={setNiche}>
                            <SelectTrigger className="bg-white/5 border-white/10 h-14 text-white">
                                <SelectValue placeholder="Select Sector" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                <SelectItem value="AI & Tech">AI & Technology</SelectItem>
                                <SelectItem value="Real Estate">Real Estate & Luxury</SelectItem>
                                <SelectItem value="Cooking & Culinary">Cooking & Culinary</SelectItem>
                                <SelectItem value="News & Media">News & Journalism</SelectItem>
                                <SelectItem value="Health & Science">Health & Science</SelectItem>
                                <SelectItem value="Finance & Law">Finance & Legal</SelectItem>
                                <SelectItem value="Fitness & Wellness">Fitness & Wellness</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Vision_Command (Prompt)</Label>
                    <textarea
                        placeholder="Describe the soul of your business..."
                        value={vision}
                        onChange={(e) => setVision(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none text-white"
                    />
                </div>

                {/* Asset Intelligence: Only Available when Store ID is active (to enforce RLS path) */}
                {activeStoreId && userId && onAssetUpload && (
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Visual_Assets</Label>
                        <AssetUploader
                            userId={userId}
                            storeId={activeStoreId}
                            onUploadComplete={onAssetUpload}
                            label="Hero Image / Logo"
                        />
                    </div>
                )}

                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Architectural_Basis</Label>

                    <Tabs defaultValue="tech-agency" className="w-full">
                        <TabsList className="bg-white/5 border border-white/5 w-full flex justify-start overflow-x-auto no-scrollbar">
                            <TabsTrigger value="tech-agency" className="text-[10px]">TECH</TabsTrigger>
                            <TabsTrigger value="luxury-ecommerce" className="text-[10px]">LUXE</TabsTrigger>
                            <TabsTrigger value="professional-services" className="text-[10px]">PRO</TabsTrigger>
                            <TabsTrigger value="media-lifestyle" className="text-[10px]">MEDIA</TabsTrigger>
                        </TabsList>

                        {SITE_TEMPLATES.categories.map(category => (
                            <TabsContent key={category.id} value={category.id} className="mt-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {category.themes.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedId(theme.id)}
                                            className={`p-4 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-2 ${selectedId === theme.id
                                                ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                                : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20 hover:bg-white/10"
                                                }`}
                                        >
                                            <Layout size={16} />
                                            {theme.name}
                                        </button>
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                <Button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="w-full h-14 bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200 shadow-xl shadow-white/5 transition-all group"
                >
                    {isGenerating ? "Injecting Logic..." : "Manual Override / Sync"}
                    <Zap size={16} className={`ml-2 group-hover:scale-125 transition-transform ${isGenerating ? 'animate-pulse' : ''}`} />
                </Button>
            </CardContent>
        </Card>
    );
}
