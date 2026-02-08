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
    children,
    onValueChange
}: {
    defaultValue: string,
    className?: string,
    children: React.ReactNode,
    onValueChange?: (value: string) => void
}) => {
    const [value, setValue] = React.useState(defaultValue)

    const handleValueChange = (newValue: string) => {
        setValue(newValue)
        onValueChange?.(newValue)
    }

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    )
}

const TabsList = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("inline-flex h-12 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground", className)}>
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
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-background/50 hover:text-foreground",
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
