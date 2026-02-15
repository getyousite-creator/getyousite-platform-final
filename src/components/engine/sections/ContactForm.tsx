'use client';

import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { captureStoreLeadAction } from '@/actions/lead-actions';
import { toast } from 'sonner';

export default function ContactForm({ content, primaryColor, backgroundColor, textColor, storeId }: any) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!storeId) {
            toast.error("Asset Isolation Error: Cannot identify store node.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        formData.append('store_id', storeId);

        try {
            const result = await captureStoreLeadAction(formData);
            if (result.success) {
                setIsSuccess(true);
                toast.success("Intelligence captured. Our team will rendezvous soon.");
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error(result.error || "Capture Protocol Failed.");
            }
        } catch (error) {
            toast.error("Engine Fault: Internal connection disrupted.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            className="py-24 px-8 relative overflow-hidden"
            style={{ backgroundColor: backgroundColor || 'transparent', color: textColor }}
        >
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-foreground tracking-tight">
                            {content?.title || 'Connect with Us'}
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {content?.description || 'Every connection is a mission. Submit your inquiry below.'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Inquiry Line</p>
                                <p className="text-lg font-bold">{content?.phone || '+212 600 000 000'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Secure Email</p>
                                <p className="text-lg font-bold">{content?.email || 'intel@getyousite.com'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">HQ Location</p>
                                <p className="text-lg font-bold">{content?.address || 'Sovereign Grid Node 01'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card p-10 rounded-3xl border border-border shadow-2xl relative">
                    {isSuccess ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">
                                {content?.successTitle || 'Transmission Complete'}
                            </h3>
                            <p className="text-muted-foreground">
                                {content?.successDesc || 'Your data is secured in our vault. Logically verified.'}
                            </p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="mt-8 text-xs font-black uppercase tracking-widest text-primary hover:underline hover:scale-110 transition-all"
                            >
                                {content?.newSignalLabel || 'Send New Signal'}
                            </button>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        {content?.nameLabel || 'Full Name'}
                                    </label>
                                    <input
                                        name="full_name"
                                        required
                                        type="text"
                                        className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all"
                                        style={{ '--tw-ring-color': primaryColor } as any}
                                        placeholder={content?.namePlaceholder || "Identification..."}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        {content?.emailLabel || 'Email Asset'}
                                    </label>
                                    <input
                                        name="email"
                                        required
                                        type="email"
                                        className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all"
                                        style={{ '--tw-ring-color': primaryColor } as any}
                                        placeholder={content?.emailPlaceholder || "email@encryption.com"}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    {content?.messageLabel || 'Strategic Inquiry'}
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all"
                                    style={{ '--tw-ring-color': primaryColor } as any}
                                    placeholder={content?.messagePlaceholder || "State your objectives..."}
                                ></textarea>
                            </div>
                            <button
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest text-white shadow-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {isSubmitting ? (
                                    <>
                                        {content?.submittingLabel || 'Transmitting...'}
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        {content?.submitLabel || 'Initiate Contact'}
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
