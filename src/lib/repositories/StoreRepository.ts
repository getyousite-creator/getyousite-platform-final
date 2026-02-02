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
    slug: string;
    template_id: string;
    settings: TemplateSettings;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
}

export abstract class StoreRepository {
    abstract getStoreBySlug(slug: string): Promise<Store | null>;
    abstract saveStore(store: Partial<Store>): Promise<Store>;
    abstract listUserStores(userId: string): Promise<Store[]>;
    abstract deleteStore(id: string): Promise<void>;
}
