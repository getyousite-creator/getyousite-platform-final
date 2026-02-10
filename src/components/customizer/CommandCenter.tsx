"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Brain, Palette, Globe, Layout,
    Search, ChevronDown, Check, Star, Zap,
    Eye, Edit3, Download, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { templates as SHARED_TEMPLATES } from '@/data/template-data';

interface CommandTemplate {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    thumbnail_url?: string;
    is_premium: boolean;
    rating?: number;
    features: string[];
}

import { generateNewPageAction } from '@/actions/generate-page';
import { toast } from 'sonner';

interface CommandCenterProps {
    businessName: string;
    setBusinessName: (name: string) => void;
    vision: string;
    setVision: (vision: string) => void;
    niche: string;
    setNiche: (niche: string) => void;
    selectedId: string;
    setSelectedId: (id: string) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    activeStoreId: string | null;
    userId: string;
    onAssetUpload: (url: string) => void;
    aiInsight?: string;
    blueprint?: any;
    selectedPageSlug?: string;
    onSelectPage?: (slug: string) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}


// Unified template source
const AVAILABLE_TEMPLATES: CommandTemplate[] = SHARED_TEMPLATES.map(t => ({
    id: t.id,
    name: t.title,
    slug: t.id,
    description: t.desc,
    category: t.category,
    thumbnail_url: t.image,
    is_premium: ['Sovereign', 'Luxury'].includes(t.badge || ''),
    rating: 4.8,
    features: t.features
}));

const NICHE_OPTIONS = [
    'AI & Tech',
    'Restaurant & Food',
    'Healthcare & Medical',
    'E-Commerce',
    'Real Estate',
    'Portfolio & Creative',
    'Business & Corporate',
    'Education',
    'Personal Blog',
    'SaaS & Software',
];

export function CommandCenter(props: CommandCenterProps) {
    const {
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
        onAssetUpload,
        aiInsight,
        blueprint,
        selectedPageSlug,
        onSelectPage
    } = props;

    const [showTemplates, setShowTemplates] = useState(false);
    const [templateSearch, setTemplateSearch] = useState('');
    const [activeTab, setActiveTab] = useState('details');
    const [pageGenLoading, setPageGenLoading] = useState<string | null>(null);

    const filteredTemplates = AVAILABLE_TEMPLATES.filter(t =>
        t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(templateSearch.toLowerCase())
    );

    const selectedTemplate = AVAILABLE_TEMPLATES.find(t => t.id === selectedId);

    const handleGeneratePage = async (slug: string, name: string) => {
        if (!activeStoreId) {
            toast.error("Save your project first to generate sub-pages.");
            return;
        }

        setPageGenLoading(slug);
        try {
            const result = await generateNewPageAction(activeStoreId, slug, name);
            if (result.success) {
                toast.success(`Protocol Synthesized: ${name} page is now online.`);
                // Refresh logic if needed, but since it's a server action that updates DB, 
                // and we're looking at blueprint from props, we might need a way to trigger 
                // a re-fetch or manual blueprint update in the parent.
                // For now, let's assume auto-save or re-load handles it.
                if (window) window.location.reload();
            } else {
                toast.error(result.message || "Synthesis failed.");
            }
        } catch (e) {
            toast.error("Critical Engine Failure");
        } finally {
            setPageGenLoading(null);
        }
    };

    return (
        <div className="space-y-6 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00D09C]/10 border border-[#00D09C]/20 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-[#00D09C]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Sovereign Architect</h2>
                        <p className="text-xs text-muted-foreground">Generates conversion-optimized sites</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 mr-4">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={props.undo}
                            disabled={!props.canUndo}
                            className="w-8 h-8 text-white/40 hover:text-white"
                            title="Undo (Ctrl+Z)"
                        >
                            <RefreshCw className="w-4 h-4 -scale-x-100" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={props.redo}
                            disabled={!props.canRedo}
                            className="w-8 h-8 text-white/40 hover:text-white"
                            title="Redo (Ctrl+Y)"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                    <Badge variant="outline" className="bg-[#00D09C]/10 text-[#00D09C] border-[#00D09C]/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        GPT-4o-mini
                    </Badge>
                </div>
            </div>


            {/* Tabs */}
            <Tabs defaultValue="details" onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-4 bg-secondary/5">
                    <TabsTrigger value="details" className="data-[state=active]:bg-secondary/20 text-[10px] font-black uppercase">
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="pages" className="data-[state=active]:bg-secondary/20 text-[10px] font-black uppercase">
                        Pages
                    </TabsTrigger>
                    <TabsTrigger value="template" className="data-[state=active]:bg-secondary/20 text-[10px] font-black uppercase">
                        Template
                    </TabsTrigger>
                    <TabsTrigger value="style" className="data-[state=active]:bg-secondary/20 text-[10px] font-black uppercase">
                        Style
                    </TabsTrigger>
                    <TabsTrigger value="agency" className="data-[state=active]:bg-secondary/20 text-[10px] font-black uppercase">
                        Agency
                    </TabsTrigger>
                </TabsList>

                {/* Agency & Security Tab */}
                <TabsContent value="agency" className="space-y-6 mt-6">
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">حصن الأمان السيادي</span>
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wide">
                            حماية البيانات: نشطة | نسخة احتياطية: فورية | تشفير SSL: 256-bit
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">إعدادات الوكالة (White-Label)</Label>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-[#00D09C]/30 transition-all">
                            <div>
                                <h4 className="text-sm font-bold text-white">إخفاء علامة GetYouSite</h4>
                                <p className="text-[9px] text-white/40 font-mono">SOVEREIGN_MODE: ENABLED</p>
                            </div>
                            <div
                                onClick={() => {/* Toggle Logic */ }}
                                className="w-12 h-6 rounded-full bg-[#00D09C]/20 border border-[#00D09C]/40 relative cursor-pointer"
                            >
                                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-[#00D09C] shadow-[0_0_10px_rgba(0,208,156,0.5)]" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">الدعم الفني الذكي (AI Support)</Label>
                        <Button className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest hover:bg-blue-500/20">
                            <RefreshCw className="w-3 h-3 mr-2" />
                            إصلاح الأخطاء تلقائياً
                        </Button>
                    </div>
                </TabsContent>

                {/* Pages Tab */}
                <TabsContent value="pages" className="space-y-6 mt-6">
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-4">
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-relaxed">
                            SOVEREIGN_GEN_PROTOCOL: Generating sub-pages separately ensures logic perfection and zero-cost efficiency.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {['index', 'about', 'services', 'contact'].map((slug) => {
                            const page = blueprint?.pages?.[slug];
                            const isDraft = !page || page.status === 'draft' || (page.layout || []).length === 0;
                            const pageName = slug === 'index' ? 'Home' : slug.charAt(0).toUpperCase() + slug.slice(1);

                            return (
                                <div
                                    key={slug}
                                    className={`p-4 rounded-2xl border transition-all ${selectedPageSlug === slug ? 'bg-[#00D09C]/5 border-[#00D09C]/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectPage?.(slug)}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDraft ? 'bg-zinc-800 text-zinc-500' : 'bg-[#00D09C]/20 text-[#00D09C]'}`}>
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{pageName}</h4>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${isDraft ? 'text-zinc-500' : 'text-[#00D09C]'}`}>
                                                    {isDraft ? 'Draft_Protocol' : 'Neural_Ready'}
                                                </span>
                                            </div>
                                        </div>

                                        {isDraft && slug !== 'index' ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleGeneratePage(slug, pageName)}
                                                disabled={pageGenLoading === slug}
                                                className="h-8 bg-blue-500/10 border-blue-500/20 text-blue-400 text-[9px] font-black tracking-widest hover:bg-blue-500/20"
                                            >
                                                {pageGenLoading === slug ? (
                                                    <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                                                ) : (
                                                    <Zap className="w-3 h-3 mr-1" />
                                                )}
                                                GENERATE
                                            </Button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onSelectPage?.(slug)}
                                                    className="h-8 text-white/40 text-[9px] font-black tracking-widest hover:text-white"
                                                >
                                                    VIEW
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                    {/* Business Name */}
                    <div className="space-y-3">
                        <Label htmlFor="businessName" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Business Name
                        </Label>
                        <Input
                            id="businessName"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g., Royal Moroccan Cuisine"
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Niche Selection */}
                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Industry / Niche
                        </Label>
                        <div className="relative">
                            <select
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground appearance-none cursor-pointer focus:border-primary transition-colors"
                            >
                                {NICHE_OPTIONS.map((option) => (
                                    <option key={option} value={option} className="bg-background text-foreground">
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {/* Vision / Description */}
                    <div className="space-y-3">
                        <Label htmlFor="vision" className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Your Vision
                        </Label>
                        <textarea
                            id="vision"
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                            placeholder="Describe your business, target audience, and what you want to achieve..."
                            rows={4}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {vision.length}/500 characters • The more details, the better the AI understands your needs
                        </p>
                    </div>

                    {/* AI Suggestions */}
                    {(aiInsight || vision.length > 20) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-bold text-blue-400 uppercase">AI Strategy</span>
                            </div>
                            <p className="text-sm text-foreground/80">
                                {aiInsight || "Analyzing your vision for structural advantages..."}
                            </p>
                        </motion.div>
                    )}
                </TabsContent>

                {/* Template Tab */}
                <TabsContent value="template" className="space-y-6 mt-6">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={templateSearch}
                            onChange={(e) => setTemplateSearch(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Template Grid */}
                    <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                        {filteredTemplates.map((template) => (
                            <motion.div
                                key={template.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedId(template.id)}
                                className={`
                                    relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all
                                    ${selectedId === template.id
                                        ? 'border-[#00D09C] ring-2 ring-[#00D09C]/20'
                                        : 'border-border hover:border-border/50'
                                    }
                                `}
                            >
                                {/* Thumbnail Placeholder */}
                                <div className="aspect-video bg-gradient-to-br from-secondary to-background flex items-center justify-center">
                                    {template.thumbnail_url ? (
                                        <img
                                            src={template.thumbnail_url}
                                            alt={template.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Layout className="w-8 h-8 text-muted-foreground" />
                                    )}
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-foreground">{template.name}</span>
                                        {template.is_premium && (
                                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 text-[10px]">
                                                <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                                PRO
                                            </Badge>
                                        )}
                                    </div>
                                    {template.rating && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                                            <span className="text-xs text-muted-foreground">{template.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Selected Indicator */}
                                {selectedId === template.id && (
                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#00D09C] flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Style Tab */}
                <TabsContent value="style" className="space-y-6 mt-6">
                    <div className="space-y-6">
                        {/* Brand Colors */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Brand Colors</Label>
                            <div className="grid grid-cols-5 gap-3">
                                {['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6366f1', '#14b8a6', '#f97316', '#06b6d4'].map((color) => (
                                    <button
                                        key={color}
                                        className="w-full aspect-square rounded-full border-2 border-border hover:border-foreground hover:scale-110 transition-all shadow-lg"
                                        style={{ backgroundColor: color }}
                                        onClick={() => { }} // No-op
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Typography</Label>
                            <div className="space-y-2">
                                {['Modern Sans', 'Elegant Serif', 'Tech Mono', 'Soft Rounded'].map(font => (
                                    <div key={font} className="p-3 rounded-xl bg-card border border-border hover:bg-secondary/10 cursor-pointer flex items-center justify-between group transition-all">
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{font}</span>
                                        <div className="w-2 h-2 rounded-full border border-border group-hover:border-primary group-hover:bg-primary transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interface Style */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Corner Style</Label>
                            <div className="flex gap-2">
                                {['Sharp', 'Round', 'Pill'].map(style => (
                                    <Button key={style} variant="outline" className="flex-1 bg-card border-border text-muted-foreground text-xs hover:text-foreground hover:bg-secondary/10">
                                        {style}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview Selected Template */}
                    {selectedTemplate && (
                        <div className="p-4 rounded-xl bg-card border border-border">
                            <h4 className="text-sm font-bold text-foreground mb-3">Selected: {selectedTemplate.name}</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedTemplate.features.map((feature) => (
                                    <Badge key={feature} variant="outline" className="border-border text-muted-foreground">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Generate Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Button
                    onClick={onGenerate}
                    disabled={!businessName || !vision || isGenerating}
                    className={`
                        w-full h-14 rounded-xl font-bold text-sm uppercase tracking-[0.2em] transition-all
                        ${isGenerating
                            ? 'bg-secondary text-muted-foreground cursor-wait'
                            : 'bg-[#00D09C] hover:bg-[#00B085] text-white shadow-[0_0_20px_rgba(0,208,156,0.3)] hover:shadow-[0_0_30px_rgba(0,208,156,0.5)]'
                        }
                    `}
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Generating Your Empire...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Website
                        </>
                    )}
                </Button>

                {!businessName || !vision ? (
                    <p className="text-center text-xs text-muted-foreground mt-3">
                        Fill in your business details to continue
                    </p>
                ) : (
                    <p className="text-center text-xs text-muted-foreground mt-3">
                        Takes approximately 30-60 seconds
                    </p>
                )}
            </motion.div>

            {/* Status */}
            {activeStoreId && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                >
                    <Check className="w-5 h-5 text-emerald-500" />
                    <div>
                        <p className="text-sm font-bold text-emerald-400">Project Saved</p>
                        <p className="text-xs text-muted-foreground">ID: {activeStoreId.slice(0, 8)}...</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
