import { supabase } from '../supabase';
import { Store, StoreRepository } from './StoreRepository';

export class SupabaseStoreRepository extends StoreRepository {
    async getStoreBySlug(slug: string): Promise<Store | null> {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('slug', slug)
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
            // Casting to any until Supabase types are generated
            .upsert(store as any)
            .select()
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

    async getPublicStores(limit: number = 20): Promise<Store[]> {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('is_public', true)
            .eq('status', 'deployed')
            .order('updated_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching public stores:', error.message);
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
