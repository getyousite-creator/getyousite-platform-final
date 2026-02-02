import * as React from "react"
import { create } from "zustand"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Minimal implementation of Tabs without external headless library for simplicity and speed
// Following the same logic as the rest of the clinical UI

interface TabsContextProps {
    value?: string
    onValueChange?: (value: string) => void
}

const TabsContext = React.createContext<TabsContextProps>({})

const Tabs = ({
    defaultValue,
    className,
    children
}: {
    defaultValue: string,
    className?: string,
    children: React.ReactNode
}) => {
    const [value, setValue] = React.useState(defaultValue)

    return (
        <TabsContext.Provider value={{ value, onValueChange: setValue }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    )
}

const TabsList = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 p-1 text-zinc-500", className)}>
        {children}
    </div>
)

const TabsTrigger = ({ value, className, children }: { value: string, className?: string, children: React.ReactNode }) => {
    const { value: activeValue, onValueChange } = React.useContext(TabsContext)
    const isActive = activeValue === value

    return (
        <button
            onClick={() => onValueChange?.(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-xs font-black uppercase tracking-widest transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "hover:bg-zinc-800/50 hover:text-zinc-300",
                className
            )}
        >
            {children}
        </button>
    )
}

const TabsContent = ({ value, className, children }: { value: string, className?: string, children: React.ReactNode }) => {
    const { value: activeValue } = React.useContext(TabsContext)
    if (activeValue !== value) return null

    return (
        <div className={cn("mt-6 ring-offset-zinc-950 focus-visible:outline-none", className)}>
            {children}
        </div>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
