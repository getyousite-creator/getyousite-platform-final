import { Layout, Cpu, Sparkles, Activity, Search, Bell, User, Settings } from "lucide-react";
import { Link } from "@/i18n/routing";
import { NexusCommandPalette } from "./NexusCommandPalette";
import { useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";

interface NexusLayoutProps {
    children: React.ReactNode;
}

export function NexusLayout({ children }: NexusLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-obsidian text-slate-100 font-sans">
            <NexusCommandPalette />

            {/* Sidebar - Invisible UI Philosophy */}
            <aside className="w-64 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl transition-all duration-500 hidden lg:flex flex-col shadow-2xl">
                <div className="px-6 py-8 border-b border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-deep to-neon-lime p-[1px] shadow-vip-glow">
                        <div className="w-full h-full rounded-[15px] bg-obsidian flex items-center justify-center">
                            <Layout className="w-5 h-5 text-neon-lime" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-lime/70">Sovereign</p>
                        <p className="text-sm font-black tracking-tighter uppercase italic">Nexus_v1</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
                    {[
                        { label: "Overview", href: "/dashboard", icon: Layout },
                        { label: "Sites", href: "/dashboard/sites", icon: Cpu },
                        { label: "Analytics", href: "/dashboard/analytics", icon: Activity },
                        { label: "Settings", href: "/dashboard/settings", icon: Settings },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 group transition-all duration-300"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-neon-lime transition-colors" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 bg-white/[0.02] border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <Cpu className="w-4 h-4 text-neon-lime" />
                        <span>Zero-latency_RSC</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <Sparkles className="w-4 h-4 text-neon-lime" />
                        <span>AI_Guided_Sync</span>
                    </div>
                </div>
            </aside>

            {/* Main Operational Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.01] backdrop-blur-md z-20">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative group max-w-md w-full hidden md:block">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-white/20" />
                            </div>
                            <input
                                type="text"
                                placeholder="Press Ctrl + K to command..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-neon-lime/30 transition-all font-medium"
                                readOnly
                                onClick={() => { }} // Command palette handles trigger
                            />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hidden lg:block italic">
                            Operational_Status: <span className="text-neon-lime animate-pulse">Optimal</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors">
                            <Bell className="w-4 h-4" />
                        </button>
                        <div className="h-10 w-px bg-white/5 mx-2" />
                        <div className="flex items-center gap-3 pl-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-widest">Sovereign_User</p>
                                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Platinum_Tier</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-lime shadow-vip-glow">
                                <User className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </section>
            </main>
        </div>
    );
}

