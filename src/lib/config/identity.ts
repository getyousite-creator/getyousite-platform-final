/**
 * SOVEREIGN IDENTITY CONFIGURATION
 * 
 * Centralized governance for administrative authority and protocol-level credentials.
 */

export const SOVEREIGN_IDENTITY = {
    // Primary administrative authority for GYS Global Protocol v7.2
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@gysglobal.com",

    // Protocol Identification
    ENGINE_VERSION: "GYS-Sovereign-Core-v2.0",
    PROTOCOL_VERSION: "SIP-7.2",

    // Deployment Thresholds
    PERFORMANCE_TARGET_MS: 1500,
    AUTH_SESSION_VALIDITY_SEC: 3600 * 24 * 7, // 1 Week
};

export function isInternalAdmin(email?: string): boolean {
    if (!email) return false;
    return email === SOVEREIGN_IDENTITY.ADMIN_EMAIL;
}
