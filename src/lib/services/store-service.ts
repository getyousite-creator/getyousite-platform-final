/**
 * Store Service
 * 
 * Business logic layer for store/site operations.
 * Enforces RLS at application level and provides clean API for controllers.
 */

import { createClient } from '@/lib/supabase/server';
import { AuthService } from './auth-service';
import { StorageService } from './storage-service';
import { SiteBlueprint } from '../schemas';

export interface Store {
    id: string;
    user_id: string;
    name: string;
    slug: string | null;
    description: string | null;
    blueprint: SiteBlueprint;
    status: 'draft' | 'pending_payment' | 'paid' | 'deploying' | 'deployed' | 'failed';
    deployment_url: string | null;
    deployed_at: string | null;
    paid_at: string | null;
    payment_id: string | null;
    amount: number | null;
    created_at: string;
    updated_at: string;
}

export interface CreateStoreData {
    name: string;
    description?: string;
    blueprint: SiteBlueprint;
}

export interface UpdateStoreData {
    name?: string;
    description?: string;
    blueprint?: SiteBlueprint;
    status?: Store['status'];
    slug?: string;
    deployment_url?: string;
    deployed_at?: Date | string;
    paid_at?: Date | string;
    payment_id?: string;
    amount?: number;
}

export interface StoreServiceError {
    message: string;
    code?: string;
}

export interface StoreServiceResult<T = Store> {
    data: T | null;
    error: StoreServiceError | null;
}

/**
 * Store Service
 * All methods enforce user authentication and RLS
 */
export const StoreService = {
    /**
     * Create a new store for the authenticated user
     */
    async createStore(data: CreateStoreData): Promise<StoreServiceResult> {
        try {
            // Require authentication
            const user = await AuthService.requireAuth();

            const supabase = await createClient();

            // @ts-ignore - Supabase types will be generated in Phase 2
            const { data: store, error } = await supabase
                .from('stores')
                .insert({
                    user_id: user.id,
                    name: data.name,
                    description: data.description || null,
                    blueprint: data.blueprint,
                    status: 'draft',
                })
                .select()
                // @ts-ignore
                .single();

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        code: error.code,
                    },
                };
            }

            return {
                data: store as Store,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Get all stores for the authenticated user
     */
    async getUserStores(): Promise<StoreServiceResult<Store[]>> {
        try {
            // Require authentication
            const user = await AuthService.requireAuth();

            const supabase = await createClient();

            const { data: stores, error } = await supabase
                .from('stores')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        code: error.code,
                    },
                };
            }

            return {
                data: stores as Store[],
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Get a single store by ID (enforces ownership via RLS)
     */
    async getStoreById(id: string): Promise<StoreServiceResult> {
        try {
            // Require authentication
            await AuthService.requireAuth();

            const supabase = await createClient();

            const { data: store, error } = await supabase
                .from('stores')
                .select('*')
                .eq('id', id)
                // @ts-ignore
                .single();

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        code: error.code,
                    },
                };
            }

            return {
                data: store as Store,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Get a deployed store by slug (public access)
     */
    async getPublicStoreBySlug(slug: string): Promise<StoreServiceResult> {
        try {
            const supabase = await createClient();

            const { data: store, error } = await supabase
                .from('stores')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'deployed')
                // @ts-ignore
                .single();

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        code: error.code,
                    },
                };
            }

            return {
                data: store as Store,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Update a store (enforces ownership via RLS)
     */
    async updateStore(id: string, data: UpdateStoreData): Promise<StoreServiceResult> {
        try {
            // Require authentication
            await AuthService.requireAuth();

            const supabase = await createClient();

            // @ts-ignore
            const { data: store, error } = await supabase
                .from('stores')
                .update({
                    ...data,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                // @ts-ignore
                .single();

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        code: error.code,
                    },
                };
            }

            return {
                data: store as Store,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Delete a store (enforces ownership via RLS)
     */
    async deleteStore(id: string): Promise<StoreServiceResult<void>> {
        try {
            // Require authentication
            await AuthService.requireAuth();

            const supabase = await createClient();

            // Sovereign Lifecycle Management: Deep Clean Assets
            // We must purge storage before deleting the record to avoid orphaned files 
            // (though RLS might block access effectively, we want to save space/cost)
            const user = await AuthService.getCurrentUser();
            if (user.data) {
                // We need to import StorageService dynamically or at top level to avoid circular deps if any
                // Assuming top level import is fine.
                await StorageService.deleteStoreAssets(user.data.id, id);
            }

            const { error: analyticsError } = await supabase
                .from('analytics')
                .delete()
                .eq('store_id', id);

            const { error: seoError } = await supabase
                .from('seo_audits')
                .delete()
                .eq('store_id', id);

            const { error } = await supabase
                .from('stores')
                .delete()
                .eq('id', id);

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        code: error.code,
                    },
                };
            }

            return {
                data: null,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Mark store as paid (after successful payment)
     */
    async markAsPaid(id: string, paymentId: string, amount: number): Promise<StoreServiceResult> {
        try {
            // Require authentication
            await AuthService.requireAuth();

            const supabase = await createClient();

            // @ts-ignore
            const { data: store, error } = await supabase
                .from('stores')
                .update({
                    status: 'paid',
                    paid_at: new Date().toISOString(),
                    payment_id: paymentId,
                    amount,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                // @ts-ignore
                .single();

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        code: error.code,
                    },
                };
            }

            return {
                data: store as Store,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Publish store with slug
     */
    async publishStore(id: string, slug: string): Promise<StoreServiceResult> {
        try {
            // Require authentication
            await AuthService.requireAuth();

            const supabase = await createClient();

            // @ts-ignore
            const { data: store, error } = await supabase
                .from('stores')
                .update({
                    status: 'deployed',
                    slug,
                    deployed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                // @ts-ignore
                .single();

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        code: error.code,
                    },
                };
            }

            return {
                data: store as Store,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },
};
