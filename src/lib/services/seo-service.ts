/**
 * SEO Service
 * 
 * Advanced SEO analysis and optimization for stores.
 * Includes keyword research, content optimization, and performance auditing.
 */

import { createClient } from '@/lib/supabase/server';
import { AuthService } from './auth-service';

export interface SEOData {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    twitterCard?: string;
    robots?: string;
    structuredData?: Record<string, any>[];
}

export interface SEOIssue {
    type: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    field?: string;
    suggestion?: string;
    priority: number;
}

export interface SEOAuditResult {
    overallScore: number;
    seoScore: number;
    performanceScore: number;
    accessibilityScore: number;
    bestPracticesScore: number;
    issues: SEOIssue[];
    recommendations: string[];
    coreWebVitals: {
        lcp: number | null;
        fid: number | null;
        cls: number | null;
    };
    keywordRankings: { keyword: string; position: number; url: string }[];
}

export interface KeywordAnalysis {
    keyword: string;
    searchVolume?: number;
    difficulty?: number;
    relevance: number;
    opportunities: string[];
}

export const SEOService = {
    /**
     * Analyze SEO for a store
     */
    async analyzeStore(storeId: string): Promise<SEOAuditResult> {
        try {
            const supabase = await createClient();

            // Get store data
            const { data: store } = await supabase
                .from('stores')
                .select('*')
                .eq('id', storeId)
                .single();

            if (!store) {
                throw new Error('Store not found');
            }

            const issues: SEOIssue[] = [];
            const recommendations: string[] = [];
            let seoScore = 100;
            let performanceScore = 100;
            let accessibilityScore = 100;
            let bestPracticesScore = 100;

            // Title Analysis
            if (!store.seo_title) {
                issues.push({
                    type: 'error',
                    category: 'Meta Tags',
                    message: 'Missing SEO title tag',
                    field: 'seo_title',
                    suggestion: 'Add a unique, descriptive title between 50-60 characters',
                    priority: 1,
                });
                seoScore -= 15;
                recommendations.push('Add a unique, descriptive title tag for better search visibility');
            } else if (store.seo_title.length < 30) {
                issues.push({
                    type: 'warning',
                    category: 'Meta Tags',
                    message: 'SEO title is too short',
                    field: 'seo_title',
                    suggestion: 'Aim for 50-60 characters for optimal display in search results',
                    priority: 2,
                });
                seoScore -= 5;
            } else if (store.seo_title.length > 60) {
                issues.push({
                    type: 'warning',
                    category: 'Meta Tags',
                    message: 'SEO title is too long and may be truncated',
                    field: 'seo_title',
                    suggestion: 'Keep title under 60 characters to prevent truncation',
                    priority: 2,
                });
                seoScore -= 5;
            }

            // Description Analysis
            if (!store.seo_description) {
                issues.push({
                    type: 'error',
                    category: 'Meta Tags',
                    message: 'Missing meta description',
                    field: 'seo_description',
                    suggestion: 'Add a compelling description between 150-160 characters',
                    priority: 1,
                });
                seoScore -= 15;
                recommendations.push('Add a meta description to improve click-through rates');
            } else if (store.seo_description.length < 120) {
                issues.push({
                    type: 'warning',
                    category: 'Meta Tags',
                    message: 'Meta description is too short',
                    field: 'seo_description',
                    suggestion: 'Aim for 150-160 characters for optimal length',
                    priority: 2,
                });
                seoScore -= 5;
            } else if (store.seo_description.length > 160) {
                issues.push({
                    type: 'warning',
                    category: 'Meta Tags',
                    message: 'Meta description may be truncated',
                    field: 'seo_description',
                    suggestion: 'Keep description under 160 characters',
                    priority: 2,
                });
                seoScore -= 5;
            }

            // Keywords Analysis
            if (!store.seo_keywords || store.seo_keywords.length === 0) {
                issues.push({
                    type: 'warning',
                    category: 'Keywords',
                    message: 'No target keywords defined',
                    field: 'seo_keywords',
                    suggestion: 'Add 5-10 relevant keywords for better targeting',
                    priority: 2,
                });
                seoScore -= 10;
            }

            // OG Image Analysis
            if (!store.og_image) {
                issues.push({
                    type: 'warning',
                    category: 'Social Media',
                    message: 'Missing Open Graph image',
                    field: 'og_image',
                    suggestion: 'Add an OG image (1200x630px recommended) for better social sharing',
                    priority: 3,
                });
                bestPracticesScore -= 5;
            }

            // Performance checks (would need actual page analysis)
            performanceScore -= 10; // Placeholder for actual performance analysis

            // Calculate overall score
            const overallScore = Math.round(
                (seoScore + performanceScore + accessibilityScore + bestPracticesScore) / 4
            );

            // Save audit result
            await supabase.from('seo_audits').insert({
                store_id: storeId,
                overall_score: overallScore,
                seo_score: seoScore,
                performance_score: performanceScore,
                accessibility_score: accessibilityScore,
                best_practices_score: bestPracticesScore,
                issues: issues,
                recommendations: recommendations,
                analyzed_at: new Date().toISOString(),
            });

            return {
                overallScore,
                seoScore,
                performanceScore,
                accessibilityScore,
                bestPracticesScore,
                issues,
                recommendations,
                coreWebVitals: {
                    lcp: null, // Would require actual page analysis
                    fid: null,
                    cls: null,
                },
                keywordRankings: [],
            };
        } catch (error) {
            console.error('SEO analysis error:', error);
            throw error;
        }
    },

    /**
     * Generate SEO recommendations for content
     */
    async generateRecommendations(
        storeId: string,
        content: string,
        targetKeywords: string[]
    ): Promise<string[]> {
        const recommendations: string[] = [];

        // Keyword density analysis
        const contentLower = content.toLowerCase();
        for (const keyword of targetKeywords) {
            const keywordLower = keyword.toLowerCase();
            const count = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
            const wordCount = content.split(/\s+/).length;
            const density = (count / wordCount) * 100;

            if (density < 0.5) {
                recommendations.push(
                    `Keyword "${keyword}" appears only ${count} times (${density.toFixed(2)}% density). ` +
                    `Consider increasing usage to 1-2% for better relevance.`
                );
            } else if (density > 3) {
                recommendations.push(
                    `Keyword "${keyword}" may be overused (${density.toFixed(2)}% density). ` +
                    `This could be seen as keyword stuffing.`
                );
            }
        }

        // Content length recommendations
        const wordCount = content.split(/\s+/).length;
        if (wordCount < 300) {
            recommendations.push(
                `Content is quite short (${wordCount} words). Consider adding more substantive content. ` +
                `Aim for at least 1000 words for better SEO performance.`
            );
        } else if (wordCount < 1000) {
            recommendations.push(
                `Consider expanding content to 1500+ words for better search rankings.`
            );
        }

        // Heading recommendations
        if (!content.includes('#') && !content.includes('<h')) {
            recommendations.push(
                'No headings found in content. Use H2 and H3 tags to structure content for better SEO.'
            );
        }

        // Image recommendations
        if (!content.includes('![') && !content.includes('<img')) {
            recommendations.push(
                'No images found in content. Adding relevant images can improve engagement and SEO.'
            );
        }

        // Internal/External link recommendations
        if (!content.includes('[') && !content.includes('<a ')) {
            recommendations.push(
                'No links found. Consider adding internal links to other pages and external links to authoritative sources.'
            );
        }

        return recommendations;
    },

    /**
     * Generate meta tags automatically using AI
     */
    async generateMetaTags(
        title: string,
        description: string,
        keywords: string[],
        content: string
    ): Promise<SEOData> {
        // Basic SEO tag generation
        const seoTitle = title.length > 60
            ? title.substring(0, 57) + '...'
            : title;

        const seoDescription = description.length > 160
            ? description.substring(0, 157) + '...'
            : description;

        // Extract potential keywords from content
        const words = content.toLowerCase().split(/\s+/);
        const wordFreq: Record<string, number> = {};
        words.forEach(word => {
            if (word.length > 4) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        // Sort by frequency and take top keywords
        const topKeywords = Object.entries(wordFreq)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);

        // Generate OG tags
        const ogTitle = seoTitle;
        const ogDescription = seoDescription;

        return {
            title: seoTitle,
            description: seoDescription,
            keywords: [...new Set([...keywords, ...topKeywords])].slice(0, 10),
            ogTitle,
            ogDescription,
            twitterCard: 'summary_large_image',
            robots: 'index, follow',
        };
    },

    /**
     * Analyze keyword opportunities
     */
    async analyzeKeywords(
        niche: string,
        existingKeywords: string[]
    ): Promise<KeywordAnalysis[]> {
        // In production, this would integrate with keyword research APIs
        // For now, we'll provide basic analysis

        const opportunities: KeywordAnalysis[] = [
            {
                keyword: `${niche} Morocco`,
                searchVolume: 1000,
                difficulty: 40,
                relevance: 0.9,
                opportunities: ['Local SEO', 'Google Maps', 'Business directories'],
            },
            {
                keyword: `best ${niche}`,
                searchVolume: 2500,
                difficulty: 60,
                relevance: 0.85,
                opportunities: ['Pillar content', 'Comparison guides', 'Reviews'],
            },
            {
                keyword: `${niche} online`,
                searchVolume: 1500,
                difficulty: 45,
                relevance: 0.8,
                opportunities: ['E-commerce integration', 'Online booking', 'Contact forms'],
            },
            {
                keyword: `affordable ${niche}`,
                searchVolume: 800,
                difficulty: 35,
                relevance: 0.75,
                opportunities: ['Pricing pages', 'Value propositions', 'Testimonials'],
            },
        ];

        return opportunities;
    },

    /**
     * Get SEO history for a store
     */
    async getSEOHistory(storeId: string, limit: number = 10) {
        try {
            const supabase = await createClient();

            const { data } = await supabase
                .from('seo_audits')
                .select('*')
                .eq('store_id', storeId)
                .order('analyzed_at', { ascending: false })
                .limit(limit);

            return data || [];
        } catch (error) {
            console.error('SEO history error:', error);
            return [];
        }
    },

    /**
     * Update store SEO data
     */
    async updateSEOData(
        storeId: string,
        seoData: Partial<SEOData>
    ): Promise<void> {
        try {
            const supabase = await createClient();

            await supabase
                .from('stores')
                .update({
                    seo_title: seoData.title,
                    seo_description: seoData.description,
                    seo_keywords: seoData.keywords,
                    og_image: seoData.ogImage,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', storeId);
        } catch (error) {
            console.error('Update SEO error:', error);
            throw error;
        }
    },
};
