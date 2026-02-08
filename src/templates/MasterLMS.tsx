"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    BookOpen,
    GraduationCap,
    Users,
    Video,
    Clock,
    Award,
    CheckCircle2,
    ChevronRight,
    Star,
    PlayCircle,
    FileText,
    Library
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";

interface Course {
    title: string;
    students: string;
    rating: string;
    img: string;
    duration: string;
}

export default function MasterLMS(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#6366f1" } = settings;

    // AI Blueprint Extraction
    const heroSection = blueprint?.layout?.find((s) => s.type === 'hero');
    const coursesSection = blueprint?.layout?.find((s) => s.type === 'features');

    const heroHeadline = (heroSection?.content?.headline as string) || headline;
    const heroSub = (heroSection?.content?.subheadline as string) || subheadline;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coursesRaw = (coursesSection?.content?.items as any[]) || [];
    const courses: Course[] = coursesRaw.length > 0 ? coursesRaw.map((item, i) => ({
        title: item.title,
        students: `${(i + 1) * 450}+`,
        rating: "4.9",
        img: item.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
        duration: `${(i + 4) * 2}h`
    })) : [
        { title: "Architecture of Sovereignty", students: "1.2k", rating: "4.9", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop", duration: "12h" },
        { title: "Neural Logic Masterclass", students: "800", rating: "4.8", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop", duration: "8h" },
        { title: "Digital Empire Economics", students: "2.5k", rating: "5.0", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop", duration: "24h" }
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-[#fcfaff] text-indigo-950 min-h-screen selection:bg-indigo-600 selection:text-white font-sans">
                    {/* LMS NAVIGATION */}
                    <nav className="h-20 px-8 lg:px-20 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-[100] border-b border-indigo-50">
                        <div className="flex items-center gap-12">
                            <span className="text-xl font-black tracking-tight uppercase border-b-2 border-indigo-600">{blueprint?.name || "ACADEMY"}</span>
                            <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-indigo-300">
                                <span className="hover:text-indigo-900 cursor-pointer">Curriculum</span>
                                <span className="hover:text-indigo-900 cursor-pointer">Instructors</span>
                                <span className="hover:text-indigo-900 cursor-pointer">Resources</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onOpen("Enroll")}
                            className="h-12 px-6 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                        >
                            Get_Access
                        </button>
                    </nav>

                    {/* HERO EDUCATION ENGINE */}
                    <section className="pt-32 pb-24 px-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />

                        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-10"
                            >
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-indigo-50 shadow-sm">
                                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Global Accreditation Verified</span>
                                </div>
                                <h1 className="text-6xl lg:text-[7vw] font-black uppercase tracking-tighter leading-[0.9] text-indigo-950">
                                    {heroHeadline}
                                </h1>
                                <p className="text-xl text-indigo-400 max-w-xl leading-relaxed font-medium">
                                    {heroSub}
                                </p>
                                <div className="flex flex-wrap gap-6 pt-4">
                                    <button
                                        className="h-16 px-10 rounded-2xl text-white font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 transition-transform"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        Explore_Courses
                                    </button>
                                    <div className="flex items-center gap-4 px-6">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100" />)}
                                        </div>
                                        <span className="text-xs font-bold text-indigo-300">Join 12k+ Scholars</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 1 }}
                                className="relative group"
                            >
                                <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-3xl border border-white">
                                    <Image
                                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                                        alt="Education"
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-indigo-900/10" />
                                    <div className="absolute bottom-10 left-10 p-8 bg-white/90 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl max-w-[300px]">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                                <PlayCircle className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Mastery_Module_01</span>
                                        </div>
                                        <p className="text-sm font-bold leading-tight">Begin your sovereign education protocol today.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* ACADEMY STATS */}
                    <section className="py-24 border-y border-indigo-50 bg-white">
                        <div className="container mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
                            {[
                                { icon: Users, value: "12,400+", label: "Total Scholars" },
                                { icon: BookOpen, value: "140", label: "Modules" },
                                { icon: Award, value: "98%", label: "Certification" },
                                { icon: Clock, value: "480h+", label: "Intelligence" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 mx-auto mb-6 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                        <stat.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="text-3xl font-black mb-1 text-indigo-950">{stat.value}</div>
                                    <div className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.3em]">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CURRICULUM GRID */}
                    <section className="py-40">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                                <div>
                                    <h2 className="text-6xl font-black uppercase tracking-tighter italic">Intelligence_Matrix.</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300 mt-4">Verified Sovereign Curriculum</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="h-12 w-12 rounded-full border border-indigo-100 flex items-center justify-center bg-white hover:bg-indigo-50 transition-colors">
                                        <Library className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {courses.map((course, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-white rounded-[48px] overflow-hidden border border-indigo-50 shadow-sm hover:shadow-2xl transition-all group"
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={course.img}
                                                alt={course.title}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                            />
                                            <div className="absolute top-6 left-6 px-4 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">CERTIFIED</div>
                                        </div>
                                        <div className="p-10 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(j => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                                                </div>
                                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{course.rating} Rating</span>
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight italic leading-none">{course.title}</h3>
                                            <div className="flex items-center gap-6 py-6 border-y border-indigo-50">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-indigo-200" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{course.students} Scholars</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-indigo-200" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{course.duration}</span>
                                                </div>
                                            </div>
                                            <button className="w-full h-16 bg-white border border-indigo-50 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-indigo-950 hover:text-white transition-all">
                                                Enroll_Now <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA BLOCK */}
                    <section className="py-40 bg-indigo-950 text-white">
                        <div className="container mx-auto px-6 text-center space-y-12">
                            <h2 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none">
                                Accelerate <br /> Your <span className="text-indigo-500">Intelligence.</span>
                            </h2>
                            <p className="text-xl text-indigo-400 max-w-2xl mx-auto leading-relaxed">Join the most advanced digital education protocol on the planet.</p>
                            <button className="h-20 px-16 bg-white text-indigo-950 rounded-3xl font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-transform">
                                INITIATE_LEARNING
                            </button>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer className="py-24 bg-white border-t border-indigo-50 flex flex-col items-center gap-10">
                        <span className="text-2xl font-black tracking-tight uppercase border-b-2 border-indigo-600">{blueprint?.name}</span>
                        <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-indigo-300">
                            <span>Courses</span>
                            <span>Community</span>
                            <span>Legal</span>
                            <span>Certificates</span>
                        </div>
                        <p className="text-[9px] text-indigo-200 font-bold uppercase tracking-[1em] mt-8">© 2026 Sovereign Intelligence Academy. All Logic Verified.</p>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
