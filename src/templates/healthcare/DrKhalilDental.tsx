"use client";

import { motion } from "framer-motion";
import { Stethoscope, ShieldCheck, Clock, Users2, Calendar, Phone, MapPin, ChevronRight, CheckCircle2, Star, LucideIcon } from "lucide-react";
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
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-sky-50 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <Icon className="w-7 h-7 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed rtl:text-right">{desc}</p>
        </div>
    );
}

const PREMIUM_IMAGES = [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop", // Hero Clinic
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop", // Patient Smile
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"  // Procedure
];

export default function DrKhalilDental(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline, subheadline } = settings;

    // Modular Extraction
    const heroSection = blueprint?.layout?.find((s: Section) => s.type === 'hero');

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-slate-50 min-h-screen font-sans selection:bg-sky-100 selection:text-sky-900 dir-rtl:text-right">

                    {/* GLASS NAVIGATION */}
                    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/50">
                        <div className="container mx-auto px-6 h-20 flex items-center justify-between rtl:flex-row-reverse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                                    <Stethoscope className="text-white w-6 h-6" />
                                </div>
                                <span className="text-xl font-black text-slate-900 tracking-tight uppercase">
                                    Dr. Khalil <span className="text-sky-600">Dental</span>
                                </span>
                            </div>
                            <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest rtl:flex-row-reverse">
                                <a href="#services" className="hover:text-sky-600 transition-colors">Services</a>
                                <a href="#about" className="hover:text-sky-600 transition-colors">Experience</a>
                                <button className="px-8 py-3 bg-slate-900 text-white rounded-full hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-600/30 transition-all active:scale-95 duration-300">
                                    Book_Appointment
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* HERO SECTION (Sovereign Level) */}
                    <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-sky-200/20 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />

                        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center rtl:flex-row-reverse">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative z-10 rtl:text-right"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-100 shadow-sm mb-8 rtl:flex-row-reverse">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">#1 CASABLANCA CLINIC</span>
                                </div>

                                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] mb-8 uppercase tracking-tighter mix-blend-darken">
                                    {heroSection?.content?.headline || headline}
                                </h1>

                                <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed font-medium rtl:ml-auto">
                                    {heroSection?.content?.subheadline || subheadline}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 rtl:flex-row-reverse">
                                    <button className="h-16 px-10 bg-sky-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-sky-700 transition-all shadow-2xl shadow-sky-600/30 flex items-center justify-center gap-3 group rtl:flex-row-reverse">
                                        Free Consultation
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                                    </button>
                                    <div className="flex items-center gap-4 px-6 border border-white bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm rtl:flex-row-reverse">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-slate-600 animate-pulse" />
                                        </div>
                                        <div className="rtl:text-right">
                                            <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Emergency_Line</div>
                                            <div className="text-sm font-bold text-slate-900 font-mono">+212 666 000 000</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl shadow-sky-900/20 border-8 border-white">
                                    <Image
                                        src={PREMIUM_IMAGES[0]}
                                        alt="Dr. Khalil Clinic Interior"
                                        fill
                                        className="object-cover scale-105 hover:scale-110 transition-transform duration-1000"
                                        priority
                                    />
                                    {/* Glass Overlay Card */}
                                    <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-2xl border border-white/30 p-6 rounded-3xl z-10 shadow-xl rtl:text-right">
                                        <div className="flex items-center gap-4 rtl:flex-row-reverse">
                                            <div className="flex -space-x-4 rtl:space-x-reverse">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden relative shadow-lg">
                                                        <Image src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Patient" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="rtl:mr-4">
                                                <div className="text-white font-black text-lg drop-shadow-md">5,000+ Smiles</div>
                                                <div className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Trust Index: 99.9%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* SERVICES (Grid Logic) */}
                    <section id="services" className="py-32 bg-white relative">
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-20 space-y-4">
                                <span className="text-sky-600 font-black uppercase tracking-[0.2em] text-xs">Clinical Precision</span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                                    World-Class <span className="text-sky-600 underline decoration-4 decoration-sky-200 underline-offset-8">Dentistry</span>
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 rtl:flex-row-reverse">
                                <ServiceCard
                                    icon={Users2}
                                    title="Invisalign Elite"
                                    desc="Platinum-tier orthodontic alignment using AI-driven 3D modeling for perfect results."
                                />
                                <ServiceCard
                                    icon={Clock}
                                    title="Rapid Response"
                                    desc="Dedicated emergency wing for immediate pain relief and trauma management 24/7."
                                />
                                <ServiceCard
                                    icon={ShieldCheck}
                                    title="Sterile Protocol"
                                    desc="Hospital-grade sterilization standards exceeding WHO guidelines for your safety."
                                />
                            </div>
                        </div>
                    </section>

                    {/* CTA SECTION */}
                    <section className="py-20 px-6">
                        <div className="container mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
                            {/* Abstract Shapes */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500 rounded-full blur-[150px]" />
                                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500 rounded-full blur-[150px]" />
                            </div>

                            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                    Ready for your <br /><span className="text-sky-400">Perfect Smile?</span>
                                </h2>
                                <p className="text-slate-400 text-lg md:text-xl font-medium">Join the 5,000+ patients who trusted Dr. Khalil with their transformation.</p>
                                <button className="h-16 px-12 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3 mx-auto">
                                    Book Your Visit Check <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* FOOTER MINI */}
                    <footer className="py-12 text-center border-t border-slate-100 bg-white">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Stethoscope className="w-5 h-5 text-sky-600" />
                            <span className="font-black text-slate-900 uppercase tracking-tight">Dr. Khalil Dental</span>
                        </div>
                        <p className="text-slate-400 text-xs uppercase tracking-widest">© 2026 Sovereign Architecture. All Rights Reserved.</p>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
