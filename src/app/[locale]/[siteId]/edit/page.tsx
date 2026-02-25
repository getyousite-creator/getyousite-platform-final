import { Suspense } from "react";
import LiquidEditor from "@/features/editor/components/LiquidEditor";

export const dynamic = 'force-dynamic';


export default function EditorPage() {
    return (
        <Suspense fallback={null}>
            <LiquidEditor />
        </Suspense>
    );
}
