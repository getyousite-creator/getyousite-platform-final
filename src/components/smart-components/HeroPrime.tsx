import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroPrimeProps {
    title: string;
    subtitle: string;
    ctaText: string;
    onCtaClick?: () => void;
    layout?: "classic" | "modern" | "impact";
    alignment?: "left" | "center" | "right";
    backgroundImage?: string;
    overlayOpacity?: number;
    colorScheme?: "dark" | "light" | "navy" | "transparent";
}

export default function HeroPrime({
    title,
    subtitle,
    ctaText,
    onCtaClick,
    layout = "modern",
    alignment = "center",
    backgroundImage,
    overlayOpacity = 0.5,
    colorScheme = "navy"
}: HeroPrimeProps) {

    // Logic Styles Map
    const styles = {
        container: cn(
            "relative w-full overflow-hidden flex items-center justify-center",
            layout === "impact" ? "h-screen min-h-[600px]" : "py-32 md:py-48"
        ),
        content: cn(
            "relative z-10 container mx-auto px-6",
            alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"
        ),
        title: cn(
            "font-black tracking-tighter mb-6",
            layout === "impact" ? "text-6xl md:text-8xl" : "text-5xl md:text-7xl",
            colorScheme === "light" ? "text-gray-900" : "text-white"
        ),
        subtitle: cn(
            "text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto leading-relaxed",
            colorScheme === "light" ? "text-gray-600" : "text-white/60"
        ),
        button: cn(
            "h-14 px-10 rounded-full text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg",
            colorScheme === "light" ? "bg-black text-white hover:bg-gray-800" : "bg-primary text-[#020617] hover:bg-blue-400 shadow-primary/20"
        )
    };

    return (
        <section className={styles.container}>
            {/* Background Layer */}
            {backgroundImage ? (
                <div className="absolute inset-0 z-0">
                    <Image src={backgroundImage} alt="Hero Background" fill priority className="object-cover" sizes="100vw" />
                    <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
                </div>
            ) : (
                <div className={cn("absolute inset-0 z-0", colorScheme === "navy" ? "bg-[#020617]" : "bg-white")}>
                    {colorScheme === "navy" && (
                        <>
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
                        </>
                    )}
                </div>
            )}

            {/* Content Core */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={styles.content}
            >
                <h1 className={styles.title}>
                    {title}
                </h1>
                <p className={styles.subtitle}>
                    {subtitle}
                </p>
                <div className={cn("flex gap-4", alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : "justify-start")}>
                    <Button
                        onClick={onCtaClick}
                        className={styles.button}
                    >
                        {ctaText} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </motion.div>
        </section>
    );
}
