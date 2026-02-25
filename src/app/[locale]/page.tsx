import { routing } from "@/i18n/routing";
import MaintenanceProtocol from "@/features/home/MaintenanceProtocol";
import StrategicHome from "@/features/home/StrategicHome";


export default function Home() {
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

    if (isMaintenanceMode) {
        return <MaintenanceProtocol />;
    }

    return <StrategicHome />;
}
