import dns from 'dns';

async function verifyLive() {
    console.log("🕵️ LIVE_PROBE: Checking https://getyousite.com...");

    try {
        const res = await fetch('https://getyousite.com', { method: 'HEAD' });
        console.log(`📡 STATUS: ${res.status} ${res.statusText}`);

        if (res.ok) {
            console.log("✅ SITE IS ONLINE!");
        } else {
            console.log("⚠️  SITE IS REACHABLE BUT RETURNED ERROR.");
        }
    } catch (error: any) {
        console.error("❌ CONNECTION FAILED:", error.cause || error.message);
    }
}

verifyLive();
