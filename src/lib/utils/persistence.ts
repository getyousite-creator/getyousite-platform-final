/**
 * SOVEREIGN PERSISTENCE LAYER
 * 
 * High-performance Redis orchestration for sub-2-second retrieval mandates.
 */

import Redis from "ioredis";

class PersistenceEngine {
    private client: Redis | null = null;
    private readonly url: string | undefined;

    constructor() {
        this.url = process.env.REDIS_URL;
    }

    private async getClient(): Promise<Redis | null> {
        if (typeof window !== 'undefined') return null; // Logic lock for server context
        if (!this.url) return null;

        if (!this.client) {
            try {
                this.client = new Redis(this.url, {
                    maxRetriesPerRequest: 1,
                    connectTimeout: 2000,
                });

                this.client.on("error", (err) => {
                    console.error("[Persistence Engine] Redis Error:", err);
                });
            } catch (e) {
                console.error("[Persistence Engine] Connection Failed:", e);
                return null;
            }
        }
        return this.client;
    }

    /**
     * Retrieves cached intelligence artifacts
     */
    async get<T>(key: string): Promise<T | null> {
        const client = await this.getClient();
        if (!client) return null;

        try {
            const data = await client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn("[Persistence Engine] Retrieval Error:", e);
            return null;
        }
    }

    /**
     * Persists synthesized artifacts with TTL
     */
    async set(key: string, value: unknown, ttlSeconds: number = 3600): Promise<void> {
        const client = await this.getClient();
        if (!client) return;

        try {
            await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
        } catch (e) {
            console.warn("[Persistence Engine] Persistance Error:", e);
        }
    }
}

export const persistence = new PersistenceEngine();
