"use client";

import { motion } from "framer-motion";
import { Activity, Calendar, Shield, MapPin, Phone, Heart } from "lucide-react";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";

interface VitalCareProps {
    settings: {
        primaryColor: string;
        secondaryColor: string;
        headline: string;
        subheadline: string;
        accentColor: string;
        fontFamily: string;
    };
}

export default function VitalCare({ settings }: VitalCareProps) {
    const { primaryColor, secondaryColor, headline, subheadline, fontFamily } = settings;
    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <motion.div
            key={updatePulse}
            animate={{ opacity: [0.95, 1] }}
            className="w-full min-h-screen bg-slate-50 text-slate-900"
            style={{ fontFamily }}
        >
            {/* Clinic Header */}
            <nav className="px-8 py-4 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                    <Activity className="w-6 h-6" style={{ color: primaryColor }} />
                    VITALCARE
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <span className="hover:text-blue-600 cursor-pointer">Specialties</span>
                    <span className="hover:text-blue-600 cursor-pointer">Find a Doctor</span>
                    <button
                        onClick={() => onOpen("VitalCare Booking")}
                        className="px-5 py-2.5 rounded-full text-white font-bold transition-all hover:scale-105"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Book Appointment
                    </button>
                </div>
            </nav>

            {/* Medical Hero */}
            <section className="px-8 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6">
                        <Shield className="w-3 h-3" />
                        ISO Certified Medical Facility
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8"
                    >
                        {headline}
                    </motion.h1>
                    <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
                        {subheadline}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => onOpen("Consultation")}
                            className="px-8 py-4 rounded-full font-bold text-white shadow-lg shadow-blue-500/20"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Start Consultation
                        </button>
                        <button className="px-8 py-4 rounded-full font-bold border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                            Our Locations
                        </button>
                    </div>
                </div>
                <div
                    onClick={() => onOpen("Virtual Tour")}
                    className="relative aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2430"
                        alt="Medical Center"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-blue-900/10" />
                </div>
            </section>

            {/* Trust Grid */}
            <section className="bg-white py-24 px-8 border-y border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeatureCard icon={Calendar} title="24/7 Support" desc="Immediate access to medical professionals anytime, anywhere." />
                    <FeatureCard icon={Heart} title="Patient First" desc="A philosophy of care centered entirely around your recovery." />
                    <FeatureCard icon={MapPin} title="Global Clinics" desc="World-class facilities across 15+ major healthcare hubs." />
                </div>
            </section>
        </motion.div>
    );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                <Icon className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
