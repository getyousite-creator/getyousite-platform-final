import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = "site-assets";

export interface UploadResult {
    path: string;
    url: string;
    width?: number;
    height?: number;
    size: number;
    type: string;
}

export const StorageService = {
    /**
     * Upload an asset to Supabase Storage with strict RLS context
     * Path: {userId}/{storeId}/{filename}
     */
    async uploadAsset(file: File, userId: string, storeId: string): Promise<{ data: UploadResult | null; error: string | null }> {
        try {
            const supabase = createClient();

            // 1. Validation (Strict Logic)
            if (!file) return { data: null, error: "No file provided" };
            if (file.size > 5 * 1024 * 1024) return { data: null, error: "File exceeds 5MB limit" };
            if (!file.type.startsWith("image/")) return { data: null, error: "Only image files are allowed" };

            // 2. Path Generation (Store-Isolated)
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `${userId}/${storeId}/${fileName}`;

            // 3. Upload
            const { data, error } = await supabase
                .storage
                .from(BUCKET_NAME)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error("Storage upload error:", error);
                return { data: null, error: error.message };
            }

            // 4. Public URL Generation
            const { data: { publicUrl } } = supabase
                .storage
                .from(BUCKET_NAME)
                .getPublicUrl(filePath);

            return {
                data: {
                    path: filePath,
                    url: publicUrl,
                    size: file.size,
                    type: file.type
                },
                error: null
            };
        } catch (e) {
            console.error("Storage Service Exception:", e);
            return { data: null, error: "Internal Storage Error" };
        }
    },

    /**
     * Delete an asset
     * @param path The relative path in storage (userId/filename) or the full URL
     */
    async deleteAsset(pathOrUrl: string): Promise<{ success: boolean; error: string | null }> {
        try {
            const supabase = createClient();

            // Extract path if a full URL is provided
            let path = pathOrUrl;
            if (pathOrUrl.startsWith("http")) {
                const urlParts = pathOrUrl.split(`${BUCKET_NAME}/`);
                if (urlParts.length > 1) {
                    path = urlParts[1];
                } else {
                    return { success: false, error: "Invalid URL format" };
                }
            }

            // Strict Validation: Ensure user is deleting their own asset (RLS will also enforce this, 
            // but we can add a pre-check if we had the user context here. For now, we rely on RLS).

            const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

            if (error) {
                console.error("Storage Delete Error:", error);
                return { success: false, error: error.message };
            }
            return { success: true, error: null };
        } catch (e) {
            return { success: false, error: "Internal Storage Error" };
        }
    },

    /**
     * Purge all assets for a specific store (Deep Clean)
     */
    async deleteStoreAssets(userId: string, storeId: string): Promise<void> {
        try {
            const supabase = createClient();
            const folderPath = `${userId}/${storeId}`;

            // 1. List all files in the store folder
            const { data: files } = await supabase
                .storage
                .from(BUCKET_NAME)
                .list(folderPath);

            if (!files || files.length === 0) return;

            // 2. Delete them
            const filePaths = files.map((f: { name: string }) => `${folderPath}/${f.name}`);
            await supabase.storage.from(BUCKET_NAME).remove(filePaths);

        } catch (e) {
            console.error("Store Purge Error:", e);
        }
    },

    /**
     * MISSION: Sovereign Asset Acquisition (Mandate #15)
     * Fetches an external image (e.g. Unsplash) and saves it permanently to our storage.
     */
    async persistExternalImage(imageUrl: string, userId: string, storeId: string): Promise<string | null> {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) return null;

            const blob = await response.blob();
            const contentType = response.headers.get('content-type') || 'image/jpeg';
            const fileExt = contentType.split('/')[1] || 'jpg';
            const fileName = `persisted_${uuidv4()}.${fileExt}`;

            const file = new File([blob], fileName, { type: contentType });
            const { data, error } = await this.uploadAsset(file, userId, storeId);

            if (error || !data) return null;
            return data.url;
        } catch (e) {
            console.error("Asset Persistence Exception:", e);
            return null;
        }
    }
};
