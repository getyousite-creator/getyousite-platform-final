/**
 * VERCEL SERVICE (SOVEREIGN GOVERNANCE)
 * Logic: Interfaces with the Vercel Platforms API to automate domain provisioning.
 * Goal: Zero-friction custom domain management.
 */

export class VercelService {
    private static API_URL = 'https://api.vercel.com/v9/projects';
    private static TEAM_ID = process.env.VERCEL_TEAM_ID;
    private static PROJECT_ID = process.env.VERCEL_PROJECT_ID;
    private static AUTH_TOKEN = process.env.VERCEL_AUTH_TOKEN;

    /**
     * Add a Custom Domain to the Project
     * Logic: Automated edge registration.
     */
    static async addDomain(hostname: string) {
        if (!this.AUTH_TOKEN) {
            console.warn("[VERCEL_SIMULATION] No Auth Token. Simulating domain addition for:", hostname);
            return { success: true, simulated: true };
        }

        const url = `${this.API_URL}/${this.PROJECT_ID}/domains${this.TEAM_ID ? `?teamId=${this.TEAM_ID}` : ''}`;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.AUTH_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: hostname }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("[VERCEL_API_ERROR]", data);
                return { success: false, error: data.error?.message || "Domain registration failed." };
            }

            return { success: true, data };
        } catch (error) {
            console.error("[VERCEL_FETCH_ERROR]", error);
            return { success: false, error: "Network failure in governance loop." };
        }
    }

    /**
     * Verify Domain Configuration
     * Logic: Monitoring DNS/SSL health.
     */
    static async verifyDomain(hostname: string) {
        if (!this.AUTH_TOKEN) return { success: true, simulated: true };

        const url = `${this.API_URL}/${this.PROJECT_ID}/domains/${hostname}/verify${this.TEAM_ID ? `?teamId=${this.TEAM_ID}` : ''}`;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.AUTH_TOKEN}`,
                },
            });

            const data = await res.json();
            return { success: res.ok, verified: data.verified };
        } catch (error) {
            return { success: false, error: "Verification loop failure." };
        }
    }
}
