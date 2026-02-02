import { supabase } from '../supabase';
import { Store, StoreRepository } from './StoreRepository';

export class SupabaseStoreRepository extends StoreRepository {
    async getStoreBySlug(slug: string): Promise<Store | null> {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('slug', slug)
            // @ts-ignore - Supabase types will be generated in Phase 2
            .single();

        if (error) {
            console.error('Error fetching store by slug:', error.message);
            return null;
        }

        return data as Store;
    }

    async saveStore(store: Partial<Store>): Promise<Store> {
        const { data, error } = await supabase
            .from('stores')
            // @ts-ignore - Supabase types will be generated in Phase 2
            .upsert(store)
            .select()
            // @ts-ignore - Supabase types will be generated in Phase 2
            .single();

        if (error) {
            throw new Error(`Critical persistence failure: ${error.message}`);
        }

        return data as Store;
    }

    async listUserStores(userId: string): Promise<Store[]> {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error listing user stores:', error.message);
            return [];
        }

        return data as Store[];
    }

    async deleteStore(id: string): Promise<void> {
        const { error } = await supabase
            .from('stores')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Deletion failure: ${error.message}`);
        }
    }
}
