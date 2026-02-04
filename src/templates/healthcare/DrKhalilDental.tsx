"use client";

import { motion } from "framer-motion";
import { Stethoscope, ShieldCheck, Clock, Users2, Calendar, Phone, MapPin, ChevronRight, LucideIcon } from "lucide-react";
import SovereignWrapper from "../SovereignWrapper";
import type { Section } from "@/lib/schemas";
import type { SovereignTemplateProps } from "@/lib/types/template";

import Image from "next/image";

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
}

function ServiceCard({ icon: Icon, title, desc }: ServiceCardProps) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-7 h-7 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

export default function DrKhalilDental(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline, subheadline } = settings;

    // Modular Extraction
    const heroSection = blueprint?.layout?.find((s: Section) => s.type === 'hero');

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-white min-h-screen font-sans selection:bg-sky-100 selection:text-sky-900">
                    {/* Navigation */}
                    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
                                    <Stethoscope className="text-white w-6 h-6" />
                                </div>
                                <span className="text-xl font-black text-slate-900 tracking-tight uppercase">Dr. Khalil <span className="text-sky-600">Dental</span></span>
                            </div>
                            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                <a href="#services" className="hover:text-sky-600 transition-colors">Services</a>
                                <a href="#about" className="hover:text-sky-600 transition-colors">About</a>
                                <button className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-sky-600 transition-all shadow-lg shadow-sky-900/10">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <section className="pt-40 pb-20 px-6">
                        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 mb-8">
                                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                                    <span className="text-[10px] font-black text-sky-700 uppercase tracking-[0.2em]">Certified Excellence</span>
                                </div>
                                <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[0.9] mb-8 uppercase tracking-tighter">
                                    {heroSection?.content?.headline || headline}
                                </h1>
                                <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed">
                                    {heroSection?.content?.subheadline || subheadline}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="h-16 px-10 bg-sky-600 text-white rounded-2xl font-bold text-lg hover:bg-sky-700 transition-all shadow-xl shadow-sky-600/20 flex items-center justify-center gap-3">
                                        Free Consultation <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-4 px-6 border border-slate-200 rounded-2xl">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-black text-slate-400">Call Us</div>
                                            <div className="text-sm font-bold text-slate-900">+212 522 000 000</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-square rounded-[40px] overflow-hidden bg-slate-100"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
                                    alt="Dental Clinic"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                                                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Patient" fill />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">5000+ Happy Smiles</div>
                                            <div className="text-white/60 text-[10px] uppercase font-bold">In Casablanca</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="services" className="py-32 bg-slate-50">
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-20 space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Premium Dental Care</h2>
                                <p className="text-slate-500 max-w-2xl mx-auto font-medium">Equipped with the latest technology for clinical precision and patient comfort.</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                <ServiceCard
                                    icon={Users2}
                                    title="Modern Orthodontics"
                                    desc="Advanced alignment solutions for all ages using Invisalign and laser-precise brackets."
                                />
                                <ServiceCard
                                    icon={Clock}
                                    title="Emergency Care"
                                    desc="24/7 priority dental emergency protocols for pain relief and urgent restoration."
                                />
                                <ServiceCard
                                    icon={MapPin}
                                    title="Digital Radiology"
                                    desc="Ultra-low radiation imaging for surgical precision and accurate diagnostics."
                                />
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </SovereignWrapper>
    );
}
