"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3, MonitorSmartphone, Shield } from "lucide-react";

const stats = [
    { label: "الزيارات", value: "18.2K", delta: "+12%", icon: BarChart3 },
    { label: "معدل التحويل", value: "4.8%", delta: "+0.6%", icon: ArrowUpRight },
    { label: "جاهزية السرعة", value: "98/100", delta: "Lighthouse", icon: MonitorSmartphone },
    { label: "حالة الأمان", value: "Shielded", delta: "RBAC On", icon: Shield },
];

export default function DashboardHome() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="vip-card p-6 md:p-8"
            >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-lime-200/70">Nexus Dashboard</p>
                        <h1 className="text-3xl md:text-4xl font-black">لوحة التحكم المركزية</h1>
                        <p className="text-white/60 mt-2 text-sm">
                            كثافة معلومات متدرجة: نظهر لك ما يهمك الآن، مع إمكانية الغوص العميق عند الحاجة.
                        </p>
                    </div>
                    <button className="vip-button px-4 py-3 text-sm magnetic-hover">
                        إنشاء موقع جديد
                    </button>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-4">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="vip-card p-4 border border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="text-xs uppercase tracking-[0.2em] text-white/50">{s.label}</div>
                                <Icon className="w-4 h-4 text-lime-200" />
                            </div>
                            <div className="text-2xl font-semibold mt-2">{s.value}</div>
                            <div className="text-xs text-lime-200/80">{s.delta}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="vip-card p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-lime-200/70">
                        معاينة مصغرة
                    </div>
                    <div className="aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-black to-[#0a2017] flex items-center justify-center text-white/40 text-xs">
                        Mini Live Preview (sync-ready)
                    </div>
                </div>
                <div className="vip-card p-5 space-y-3 md:col-span-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-lime-200/70">
                        رؤى الذكاء الاصطناعي
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80">
                        ارتفعت الزيارات 12٪ هذا الأسبوع. اقترح Gemini: اجعل زر الشراء في صفحة المنتج باللون
                        <span className="text-lime-200"> accent-neon</span> لتعزيز التباين.
                    </div>
                </div>
            </div>
        </div>
    );
}
