"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layout, Sparkles } from "lucide-react";

const palette = [
  { name: "Primary Deep", var: "--primary-deep", desc: "Emerald trust" },
  { name: "Accent Neon", var: "--accent-neon", desc: "AI energy" },
  { name: "Obsidian", var: "--neutral-obsidian", desc: "Luxury base" },
  { name: "Surface Slate", var: "--surface-slate", desc: "Panels" },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 p-8 md:p-16 space-y-12">
      <header className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <Layout className="w-6 h-6 text-lime-300" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lime-200/70">VIP · Design System</p>
          <h1 className="text-3xl md:text-4xl font-black">Sovereign Visual Identity</h1>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="vip-card p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-lime-200/60">Palette</p>
          <div className="grid grid-cols-2 gap-4">
            {palette.map((c) => (
              <div key={c.var} className="space-y-2">
                <div
                  className="h-16 rounded-xl border border-white/5"
                  style={{ background: `var(${c.var})` }}
                />
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-white/50">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="vip-card p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-lime-200/60">Typography</p>
          <div className="space-y-3">
            <div className="text-3xl font-black">Clash / (fallback Inter)</div>
            <div className="text-lg text-white/70">Satoshi Body / (fallback Inter)</div>
            <div className="text-sm text-white/50">
              قاعدة الذهبية 1.618: العنوان ÷ النص = 1.618 للحفاظ على راحة العين.
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="vip-card p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-lime-200/60">Buttons</p>
          <div className="space-y-3">
            <button className="vip-button px-4 py-3 w-full magnetic-hover">Primary Action</button>
            <button className="vip-button px-4 py-3 w-full magnetic-hover" style={{ background: "var(--accent-neon)", color: "#0A0A0A" }}>
              Accent Action
            </button>
          </div>
        </div>

        <div className="vip-card p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-lime-200/60">Cards</p>
          <div className="grid gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="glass-card p-4 rounded-2xl border-white/5">
                <div className="text-sm text-white/60">Frosted glass · #{i}</div>
                <div className="text-lg font-semibold">Tangible Luxury Interface</div>
              </div>
            ))}
          </div>
        </div>

        <div className="vip-card p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-lime-200/60">States & Motion</p>
          <motion.div
            whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
            className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
          >
            <div className="flex items-center gap-2 text-lime-300">
              <Sparkles className="w-4 h-4" />
              Hover Magnetic
            </div>
            <p className="text-sm text-white/60 mt-2">Framer Motion spring transition on hover.</p>
          </motion.div>
          <div className="h-10 rounded-full bg-[var(--accent-neon)]/20 border border-lime-200/30 flex items-center justify-center text-xs text-lime-100 tracking-[0.2em]">
            Loading · Glow
          </div>
        </div>
      </section>
    </div>
  );
}
