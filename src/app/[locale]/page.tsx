import MaintenanceProtocol from "@/components/home/MaintenanceProtocol";
import StrategicHome from "@/components/home/StrategicHome";

export default function Home() {
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

    if (isMaintenanceMode) {
        return <MaintenanceProtocol />;
    }

    return <StrategicHome />;
}
