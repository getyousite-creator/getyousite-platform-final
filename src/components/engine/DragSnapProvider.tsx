"use client";

import React from "react";
import React from "react";

type Props = {
    children: React.ReactNode;
};

// Placeholder now that we removed dnd-kit dependency; keeps component tree stable.
export function DragSnapProvider({ children }: Props) {
    return <>{children}</>;
}
