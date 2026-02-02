"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

const DialogContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
}>({
    open: false,
    onOpenChange: () => { },
})

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
    const [isOpen, setIsOpen] = React.useState(open)

    React.useEffect(() => {
        setIsOpen(open)
    }, [open])

    const handleOpenChange = React.useCallback(
        (value: boolean) => {
            setIsOpen(value)
            onOpenChange?.(value)
        },
        [onOpenChange]
    )

    return (
        <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
            {children}
        </DialogContext.Provider>
    )
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
    const { open, onOpenChange } = React.useContext(DialogContext)

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={() => onOpenChange(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={cn(
                            "relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden",
                            className
                        )}
                    >
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-[10]"
                        >
                            <X size={20} />
                        </button>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h2 className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)} {...props} />
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={cn("text-sm text-zinc-500", className)} {...props} />
}
