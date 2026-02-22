/**
 * User Pulse Status - Placeholder
 */

"use client";

import React from "react";

export function UserPulseStatus() {
    return (
        <div className="flex items-center gap-2 text-sm text-neutral-slate">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>User</span>
        </div>
    );
}
