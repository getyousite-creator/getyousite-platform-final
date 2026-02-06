export interface TemplateSettings {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    businessName: string;
    businessDescription: string;
    language: string;
    [key: string]: any;
}

export interface Store {
    id: string;
    user_id?: string;
    name: string;
    slug: string;
    description?: string;
    template_id: string;
    status: 'draft' | 'pending_payment' | 'paid' | 'deploying' | 'deployed' | 'failed';
    settings: TemplateSettings;
    created_at?: string;
    updated_at?: string;
    paid_at?: string;
    payment_id?: string;
    amount?: number;
}

export abstract class StoreRepository {
    abstract getStoreBySlug(slug: string): Promise<Store | null>;
    abstract saveStore(store: Partial<Store>): Promise<Store>;
    abstract listUserStores(userId: string): Promise<Store[]>;
    abstract deleteStore(id: string): Promise<void>;
}
