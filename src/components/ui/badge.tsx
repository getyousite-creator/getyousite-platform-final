import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
                secondary:
                    "border-transparent bg-zinc-800 text-zinc-400 hover:bg-zinc-800/80",
                destructive:
                    "border-transparent bg-red-500 text-white hover:bg-red-500/80",
                outline: "text-zinc-400 border-zinc-800",
                success: "border-transparent bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
