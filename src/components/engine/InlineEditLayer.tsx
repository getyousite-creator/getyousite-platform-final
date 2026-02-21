"use client";

import React, { useState } from "react";

interface Props {
    children: React.ReactNode;
    onTextChange?: (text: string) => void;
}

/**
 * Minimal inline-edit scaffold: makes any child text editable on double click.
 * Real mapping to blueprint happens via onTextChange callback.
 */
export function InlineEditLayer({ children, onTextChange }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState("");

    const startEdit = (e: React.MouseEvent<HTMLDivElement>) => {
        const text = (e.target as HTMLElement)?.innerText || "";
        setValue(text);
        setIsEditing(true);
    };

    return (
        <div
            onDoubleClick={startEdit}
            className="relative"
        >
            {isEditing ? (
                <div
                    contentEditable
                    suppressContentEditableWarning
                    className="outline-none ring-2 ring-lime-300/60 rounded-md p-1 bg-white/5"
                    onBlur={(e) => {
                        const next = e.currentTarget.innerText;
                        setIsEditing(false);
                        onTextChange?.(next);
                    }}
                    onInput={(e) => setValue((e.currentTarget as HTMLElement).innerText)}
                >
                    {value}
                </div>
            ) : (
                children
            )}
        </div>
    );
}
