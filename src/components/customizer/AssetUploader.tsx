"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { StorageService } from "@/lib/services/storage-service";
import { toast } from "sonner";
import Image from "next/image";

interface AssetUploaderProps {
    userId: string; // Required for RLS path generation
    storeId: string; // Required for isolation
    currentImageUrl?: string;
    onUploadComplete: (url: string) => void;
    label?: string;
}

export function AssetUploader({ userId, storeId, currentImageUrl, onUploadComplete, label = "Upload Asset" }: AssetUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Strict Logic: Verify file type immediately before service call
        if (!file.type.startsWith("image/")) {
            toast.error("Strict Error: Only image files permitted.");
            setIsUploading(false);
            return;
        }

        try {
            const { data, error } = await StorageService.uploadAsset(file, userId, storeId);

            if (error) {
                toast.error(`Upload Failed: ${error}`);
            } else if (data) {
                setPreviewUrl(data.url);
                onUploadComplete(data.url);
                toast.success("Asset Secured in Storage.");
            }
        } catch (err) {
            console.error("Upload Component Error:", err);
            toast.error("Critical Upload Error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
                {previewUrl && (
                    <button
                        onClick={() => { setPreviewUrl(""); onUploadComplete(""); }}
                        className="text-[10px] text-red-500 hover:text-red-400 uppercase font-bold"
                    >
                        Remove
                    </button>
                )}
            </div>

            <div
                className={`relative group border border-dashed rounded-xl transition-all overflow-hidden ${previewUrl
                    ? 'border-border bg-card/10 h-32'
                    : 'border-border hover:border-primary/50 hover:bg-card/10 h-20 cursor-pointer'
                    }`}
                onClick={() => !previewUrl && fileInputRef.current?.click()}
            >
                {/* Input (Hidden) */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {/* State: Uploading */}
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-10">
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    </div>
                )}

                {/* State: Preview */}
                {previewUrl ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={previewUrl}
                            alt="Asset Preview"
                            fill
                            className="object-cover"
                        />
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 text-foreground"
                            >
                                <Upload size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    /* State: Empty */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground group-hover:text-foreground">
                        <Upload size={16} />
                        <span className="text-[10px] uppercase font-bold">Click to Upload</span>
                    </div>
                )}
            </div>
        </div>
    );
}
