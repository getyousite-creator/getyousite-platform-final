"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    label: string;
}

interface CategoryFilterProps {
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (id: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={cn(
                        "relative px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300",
                        activeCategory === category.id
                            ? "text-white"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    )}
                >
                    {activeCategory === category.id && (
                        <motion.div
                            layoutId="active-category"
                            className="absolute inset-0 bg-blue-600 rounded-full -z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    {category.label}
                </button>
            ))}
        </div>
    );
}
