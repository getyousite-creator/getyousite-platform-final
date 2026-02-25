"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Zap, Users, MousePointer2, CreditCard, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const data = [
    { name: "Sat", value: 400 },
    { name: "Sun", value: 300 },
    { name: "Mon", value: 200 },
    { name: "Tue", value: 278 },
    { name: "Wed", value: 189 },
    { name: "Thu", value: 239 },
    { name: "Fri", value: 349 },
];

export function NexusStatCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Visitors"
                value="12,842"
                change="+14.2%"
                icon={<Users className="w-4 h-4" />}
                insight="زيادة ملحوظة في الزيارات. نوصي بتنشيط العروض الخاصة."
            />
            <StatCard
                title="Conversion Rate"
                value="3.2%"
                change="+0.8%"
                icon={<MousePointer2 className="w-4 h-4" />}
                insight="معدل التحويل مستقر. تحسين الـ CTA قد يرفعه بنسبة 1% إضافية."
            />
            <StatCard
                title="Total Revenue"
                value="$4,250"
                change="+22.5%"
                icon={<CreditCard className="w-4 h-4" />}
                insight="أداء مالي متميز. العملاء يفضلون باقة الـ Pro هذا الأسبوع."
            />
            <StatCard
                title="Sovereign Stability"
                value="99.9%"
                change="+0.1%"
                icon={<Zap className="w-4 h-4 text-primary" />}
                insight="النظام يعمل باستقرار مؤسسي فائق مع التزام كامل ببروتوكول DIP."
            />
        </div>
    );
}

function StatCard({ title, value, change, icon, insight }: { title: string; value: string; change: string; icon: React.ReactNode; insight: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl space-y-4 shadow-xl relative overflow-hidden group"
        >
            <div className="flex items-center justify-between text-white/40">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:text-lime-300 transition-colors">
                    {icon}
                </div>
            </div>

            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
                <span className="text-[10px] font-black text-lime-400">{change}</span>
            </div>

            <div className="h-16 w-full -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#BEF264" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#BEF264" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#BEF264"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-start gap-2 text-[10px] text-white/30 leading-relaxed font-medium">
                <Sparkles className="w-3 h-3 text-lime-300 shrink-0 mt-0.5" />
                <p>{insight}</p>
            </div>
        </motion.div>
    );
}
