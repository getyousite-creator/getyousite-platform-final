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

interface Template {
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
}

// Mock templates for demo
const AVAILABLE_TEMPLATES: Template[] = [
    {
        id: 't1-quantum',
        name: 'Tech Startup',
        slug: 'tech-startup',
        description: 'Modern, cutting-edge design for technology startups',
        category: 'saas',
        thumbnail_url: '/images/tech-startup.png',
        is_premium: false,
        rating: 4.8,
        features: ['Dark Mode', 'Pricing Tables', 'Features Grid']
    },
    {
        id: 't2-creative',
        name: 'Creative Portfolio',
        slug: 'creative-portfolio',
        description: 'Stunning portfolio for designers and creatives',
        category: 'portfolio',
        thumbnail_url: '/images/creative-portfolio.png',
        is_premium: false,
        rating: 4.9,
        features: ['Gallery Grid', 'About Section', 'Contact Form']
    },
    {
        id: 't3-ecommerce',
        name: 'E-Commerce Store',
        slug: 'ecommerce-store',
        description: 'Complete e-commerce solution with product showcases',
        category: 'ecommerce',
        thumbnail_url: '/images/ecommerce-store.png',
        is_premium: true,
        rating: 4.7,
        features: ['Product Showcase', 'Categories', 'Reviews']
    },
    {
        id: 't4-medical',
        name: 'Medical Clinic',
        slug: 'medical-clinic',
        description: 'Professional healthcare website for medical practices',
        category: 'medical',
        thumbnail_url: '/images/medical-clinic.png',
        is_premium: false,
        rating: 4.6,
        features: ['Services List', 'Doctors Team', 'Appointments']
    },
    {
        id: 't5-restaurant',
        name: 'Luxury Restaurant',
        slug: 'restaurant-luxury',
        description: 'Elegant dining experience website',
        category: 'restaurant',
        thumbnail_url: '/images/restaurant-luxury.png',
        is_premium: true,
        rating: 4.8,
        features: ['Menu Section', 'Reservations', 'Gallery']
    },
    {
        id: 't6-realestate',
        name: 'Real Estate Agency',
        slug: 'realestate-agency',
        description: 'Property listings and agent profiles',
        category: 'realestate',
        thumbnail_url: '/images/realestate-agency.png',
        is_premium: false,
        rating: 4.5,
        features: ['Property Listings', 'Agent Profiles', 'Search']
    },
];

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
    onAssetUpload,
    aiInsight,
}: CommandCenterProps) {
    const [showTemplates, setShowTemplates] = useState(false);
    const [templateSearch, setTemplateSearch] = useState('');
    const [activeTab, setActiveTab] = useState('details');

    const filteredTemplates = AVAILABLE_TEMPLATES.filter(t =>
        t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
        t.category.toLowerCase().includes(templateSearch.toLowerCase())
    );

    const selectedTemplate = AVAILABLE_TEMPLATES.find(t => t.id === selectedId);

    return (
        <div className="space-y-6 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">AI Architect</h2>
                        <p className="text-xs text-zinc-500">Generates conversion-optimized sites</p>
                    </div>
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    GPT-4 Powered
                </Badge>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 bg-white/5">
                    <TabsTrigger value="details" className="data-[state=active]:bg-white/10">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="template" className="data-[state=active]:bg-white/10">
                        <Layout className="w-4 h-4 mr-2" />
                        Template
                    </TabsTrigger>
                    <TabsTrigger value="style" className="data-[state=active]:bg-white/10">
                        <Palette className="w-4 h-4 mr-2" />
                        Style
                    </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                    {/* Business Name */}
                    <div className="space-y-3">
                        <Label htmlFor="businessName" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Business Name
                        </Label>
                        <Input
                            id="businessName"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g., Royal Moroccan Cuisine"
                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Niche Selection */}
                    <div className="space-y-3">
                        <Label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Industry / Niche
                        </Label>
                        <div className="relative">
                            <select
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:border-blue-500 transition-colors"
                            >
                                {NICHE_OPTIONS.map((option) => (
                                    <option key={option} value={option} className="bg-zinc-900">
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Vision / Description */}
                    <div className="space-y-3">
                        <Label htmlFor="vision" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Your Vision
                        </Label>
                        <textarea
                            id="vision"
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                            placeholder="Describe your business, target audience, and what you want to achieve..."
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:border-blue-500 transition-colors resize-none"
                        />
                        <p className="text-xs text-zinc-500">
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
                            <p className="text-sm text-zinc-300">
                                {aiInsight || "Analyzing your vision for structural advantages..."}
                            </p>
                        </motion.div>
                    )}
                </TabsContent>

                {/* Template Tab */}
                <TabsContent value="template" className="space-y-6 mt-6">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={templateSearch}
                            onChange={(e) => setTemplateSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:border-blue-500 transition-colors"
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
                                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                                        : 'border-white/10 hover:border-white/30'
                                    }
                                `}
                            >
                                {/* Thumbnail Placeholder */}
                                <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                                    {template.thumbnail_url ? (
                                        <img
                                            src={template.thumbnail_url}
                                            alt={template.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Layout className="w-8 h-8 text-zinc-600" />
                                    )}
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-white">{template.name}</span>
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
                                            <span className="text-xs text-zinc-400">{template.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Selected Indicator */}
                                {selectedId === template.id && (
                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Style Tab */}
                <TabsContent value="style" className="space-y-6 mt-6">
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                        <Palette className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Smart Styling</h3>
                        <p className="text-sm text-zinc-400 mb-4">
                            The AI will automatically generate colors, typography, and spacing based on your industry and vision.
                        </p>
                        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                            <Zap className="w-4 h-4 mr-2" />
                            Auto-Generate Styles
                        </Button>
                    </div>

                    {/* Preview Selected Template */}
                    {selectedTemplate && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <h4 className="text-sm font-bold text-white mb-3">Selected: {selectedTemplate.name}</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedTemplate.features.map((feature) => (
                                    <Badge key={feature} variant="outline" className="border-white/20 text-zinc-400">
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
                        w-full h-14 rounded-xl font-bold text-sm uppercase tracking-[0.2em]
                        ${isGenerating
                            ? 'bg-zinc-800 text-zinc-400 cursor-wait'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25'
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
                    <p className="text-center text-xs text-zinc-500 mt-3">
                        Fill in your business details to continue
                    </p>
                ) : (
                    <p className="text-center text-xs text-zinc-500 mt-3">
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
                        <p className="text-xs text-zinc-500">ID: {activeStoreId.slice(0, 8)}...</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
