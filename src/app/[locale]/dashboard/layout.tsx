"use client";

import React from "react";
import { NexusLayout } from "@/components/dashboard/NexusLayout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <NexusLayout>{children}</NexusLayout>;
}
