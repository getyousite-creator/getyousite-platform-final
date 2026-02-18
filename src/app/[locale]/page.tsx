import MaintenanceProtocol from "@/components/home/MaintenanceProtocol";
import InstantPromptHome from "@/components/home/InstantPromptHome";

export default function Home() {
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

    if (isMaintenanceMode) {
        return <MaintenanceProtocol />;
    }

    return <InstantPromptHome />;
}
