"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { track } from "@vercel/analytics";

const COPY = {
    ar: {
        question: "ماذا تريد أن تبني؟",
        placeholder: "مطعم، محامٍ، متجر، صالون تجميل...",
    },
    default: {
        question: "What do you want to build?",
        placeholder: "Restaurant, lawyer, store, beauty salon...",
    },
};

export default function InstantPromptHome() {
    const locale = useLocale();
    const router = useRouter();
    const [value, setValue] = useState("");
    const [typingStarted, setTypingStarted] = useState(false);

    const isArabic = locale === "ar";
    const text = isArabic ? COPY.ar : COPY.default;

    const handleSubmit = () => {
        const prompt = value.trim();
        if (!prompt) return;
        track("funnel_home_prompt_submit", {
            locale,
            prompt_length: prompt.length,
        });
        router.push(`/customizer?vision=${encodeURIComponent(prompt)}`);
    };

    return (
        <main
            dir={isArabic ? "rtl" : "ltr"}
            className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-5 sm:px-6"
        >
            <div className="w-full max-w-3xl transition-all duration-300 py-10 md:py-0">
                {!typingStarted && (
                    <h1 className="text-center text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-7 md:mb-8 leading-tight">
                        {text.question}
                    </h1>
                )}

                <input
                    type="text"
                    value={value}
                    dir={isArabic ? "rtl" : "ltr"}
                    onChange={(event) => {
                        setValue(event.target.value);
                        if (!typingStarted && event.target.value.length > 0) {
                            setTypingStarted(true);
                            track("funnel_home_typing_started", { locale });
                        }
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                    placeholder={text.placeholder}
                    className="w-full rounded-3xl border border-white/20 bg-white/5 px-5 sm:px-7 py-5 sm:py-6 text-lg sm:text-xl md:text-3xl placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
                />
            </div>
        </main>
    );
}
