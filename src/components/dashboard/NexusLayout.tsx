import React from "react";
import { Layout, Cpu, Sparkles, Activity } from "lucide-react";
import Link from "next/link";

interface NexusLayoutProps {
    children: React.ReactNode;
}

export function NexusLayout({ children }: NexusLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-[var(--neutral-obsidian,#0A0A0A)] text-slate-100">
            <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hidden md:flex flex-col">
                <div className="px-4 py-5 border-b border-white/10 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-lime-300/40 to-emerald-500/40 border border-white/10">
                        <Layout className="w-5 h-5 text-lime-200" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-lime-200/70">Nexus</p>
                        <p className="text-sm font-semibold">Control Room</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
                    {[
                        { label: "Overview", href: "/[locale]/dashboard" },
                        { label: "Sites", href: "/[locale]/dashboard/sites" },
                        { label: "Analytics", href: "/[locale]/dashboard/analytics" },
                        { label: "Settings", href: "/[locale]/dashboard/settings" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-300/60" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="px-4 pb-5 text-xs text-white/50">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-lime-300" />
                        Zero-latency RSC
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Sparkles className="w-4 h-4 text-lime-300" />
                        AI-guided actions
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-3">
                        <div className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-white/70">
                            <span className="hidden sm:inline text-white/40">Ctrl + K</span>
                            <span className="uppercase tracking-[0.25em] text-lime-200/80">Command</span>
                        </div>
                        <p className="text-xs text-white/50">نفّذ الأوامر فوراً (بحث، تنقل، أوامر تصميم)</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-lime-200/80">
                        <Activity className="w-4 h-4 animate-pulse" />
                        Live Sync
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
                    {children}
                </section>
            </main>
        </div>
    );
}
