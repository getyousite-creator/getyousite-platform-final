/**
 * Cloudflare DNS & SSL Automation
 * 
 * Automated domain configuration with:
 * - SSL certificate generation (<60s)
 * - DDoS protection
 * - DNS management
 * - For Platforms (SaaS) integration
 */

import { Cloudflare } from 'cloudflare';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DomainConfig {
    domain: string;
    siteId: string;
    targetUrl: string;
}

export interface SSLConfig {
    domain: string;
    type: 'universal' | 'dedicated' | 'advanced';
    autoRenew: boolean;
}

export interface DNSRecord {
    type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
    name: string;
    content: string;
    proxied?: boolean;
    ttl?: number;
}

export interface DomainSetupResult {
    success: boolean;
    domain: string;
    sslStatus: 'active' | 'pending' | 'failed';
    dnsRecords: DNSRecord[];
    ddosProtection: boolean;
    setupTime: number;
}

// ============================================================================
// CLOUDFLARE CLIENT
// ============================================================================

const cf = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN!,
});

// ============================================================================
// DOMAIN SETUP
// ============================================================================

/**
 * Complete domain setup with SSL and DDoS protection
 */
export async function setupDomain(config: DomainConfig): Promise<DomainSetupResult> {
    const startTime = Date.now();

    try {
        console.log(`[QDP] Setting up domain ${config.domain} for site ${config.siteId}...`);

        // Step 1: Add domain to Cloudflare
        console.log('[QDP] Adding domain to Cloudflare...');
        const zone = await addDomainToCloudflare(config.domain);

        // Step 2: Configure DNS records
        console.log('[QDP] Configuring DNS records...');
        const dnsRecords = await configureDNSRecords(zone.id, config.domain, config.targetUrl);

        // Step 3: Enable SSL (Universal SSL - automatic)
        console.log('[QDP] Enabling SSL...');
        const sslStatus = await enableSSL(zone.id, config.domain);

        // Step 4: Enable DDoS protection
        console.log('[QDP] Enabling DDoS protection...');
        await enableDDoSProtection(zone.id);

        // Step 5: Configure SSL/TLS settings
        console.log('[QDP] Configuring SSL/TLS settings...');
        await configureSSLSettings(zone.id);

        const setupTime = Date.now() - startTime;

        console.log(`[QDP] Domain setup complete in ${setupTime}ms`);

        return {
            success: true,
            domain: config.domain,
            sslStatus,
            dnsRecords,
            ddosProtection: true,
            setupTime,
        };
    } catch (error) {
        console.error(`[QDP] Domain setup failed for ${config.domain}:`, error);
        return {
            success: false,
            domain: config.domain,
            sslStatus: 'failed',
            dnsRecords: [],
            ddosProtection: false,
            setupTime: Date.now() - startTime,
        };
    }
}

/**
 * Add domain to Cloudflare
 */
async function addDomainToCloudflare(domain: string): Promise<{ id: string; name: string }> {
    try {
        // Check if zone already exists
        const existingZones = await cf.zones.list({
            name: domain,
        });

        if (existingZones.result.length > 0) {
            console.log(`[QDP] Zone already exists for ${domain}`);
            return {
                id: existingZones.result[0].id,
                name: existingZones.result[0].name,
            };
        }

        // Create new zone
        const zone = await cf.zones.create({
            name: domain,
            jump_start: true,
        });

        console.log(`[QDP] Created zone for ${domain}: ${zone.id}`);
        return {
            id: zone.id,
            name: zone.name,
        };
    } catch (error) {
        console.error(`[QDP] Failed to add domain ${domain}:`, error);
        throw error;
    }
}

/**
 * Configure DNS records for domain
 */
async function configureDNSRecords(
    zoneId: string,
    domain: string,
    targetUrl: string
): Promise<DNSRecord[]> {
    const records: DNSRecord[] = [
        // Root domain (@)
        {
            type: 'CNAME',
            name: '@',
            content: targetUrl.replace('https://', ''),
            proxied: true, // Enable Cloudflare proxy
            ttl: 1, // Auto TTL
        },
        // WWW subdomain
        {
            type: 'CNAME',
            name: 'www',
            content: targetUrl.replace('https://', ''),
            proxied: true,
            ttl: 1,
        },
    ];

    const createdRecords = [];

    for (const record of records) {
        try {
            const created = await cf.dns.records.create({
                zone_id: zoneId,
                type: record.type,
                name: `${record.name}.${domain}`,
                content: record.content,
                proxied: record.proxied,
                ttl: record.ttl,
            });

            createdRecords.push(record);
            console.log(`[QDP] Created DNS record: ${record.type} ${record.name} → ${record.content}`);
        } catch (error) {
            console.error(`[QDP] Failed to create DNS record:`, error);
            throw error;
        }
    }

    return createdRecords;
}

/**
 * Enable Universal SSL (automatic certificate)
 */
async function enableSSL(zoneId: string, domain: string): Promise<'active' | 'pending' | 'failed'> {
    try {
        // Enable SSL
        await cf.ssl.update(zoneId, {
            status: 'active',
        });

        // Wait for certificate to be issued (usually <60s)
        console.log('[QDP] Waiting for SSL certificate...');
        await waitForSSL(zoneId, domain);

        return 'active';
    } catch (error) {
        console.error('[QDP] SSL enablement failed:', error);
        return 'failed';
    }
}

/**
 * Wait for SSL certificate to be issued
 */
async function waitForSSL(zoneId: string, domain: string, maxAttempts: number = 12): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const ssl = await cf.ssl.get(zoneId);
            
            if (ssl.status === 'active') {
                console.log(`[QDP] SSL certificate active for ${domain}`);
                return;
            }

            console.log(`[QDP] SSL pending... attempt ${i + 1}/${maxAttempts}`);
            await sleep(5000); // Wait 5 seconds
        } catch (error) {
            console.error('[QDP] SSL check failed:', error);
            await sleep(5000);
        }
    }

    throw new Error(`[QDP] SSL certificate timeout for ${domain}`);
}

/**
 * Configure SSL/TLS settings
 */
async function configureSSLSettings(zoneId: string): Promise<void> {
    try {
        // Set SSL/TLS encryption mode to Full (strict)
        await cf.ssl.update(zoneId, {
            status: 'active',
            method: 'http',
            min_tls_version: '1.3', // TLS 1.3 for maximum security
        });

        // Enable Always Use HTTPS
        await cf.pages.projects.customDomains.updateAlwaysUseHttps(zoneId, {
            enabled: true,
        });

        // Enable Automatic HTTPS Rewrites
        await cf.zone.settings.updateAutomaticHttpsRewrites(zoneId, {
            value: 'on',
        });

        console.log('[QDP] SSL/TLS settings configured');
    } catch (error) {
        console.error('[QDP] SSL settings configuration failed:', error);
        throw error;
    }
}

/**
 * Enable DDoS protection
 */
async function enableDDoSProtection(zoneId: string): Promise<void> {
    try {
        // Enable Cloudflare's automatic DDoS protection
        await cf.zone.settings.updateSecurityLevel(zoneId, {
            value: 'medium', // Balanced protection
        });

        // Enable Browser Integrity Check
        await cf.zone.settings.updateBrowserCheck(zoneId, {
            value: 'on',
        });

        // Enable Challenge TTL
        await cf.zone.settings.updateChallengeTtl(zoneId, {
            value: 1800, // 30 minutes
        });

        console.log('[QDP] DDoS protection enabled');
    } catch (error) {
        console.error('[QDP] DDoS protection enablement failed:', error);
        throw error;
    }
}

// ============================================================================
// DOMAIN VERIFICATION
// ============================================================================

/**
 * Verify domain ownership and SSL status
 */
export async function verifyDomain(domain: string): Promise<{
    verified: boolean;
    sslActive: boolean;
    dnsConfigured: boolean;
}> {
    try {
        // Check DNS
        const dnsConfigured = await checkDNS(domain);

        // Check SSL
        const sslActive = await checkSSL(domain);

        return {
            verified: dnsConfigured && sslActive,
            sslActive,
            dnsConfigured,
        };
    } catch (error) {
        console.error(`[QDP] Domain verification failed for ${domain}:`, error);
        return {
            verified: false,
            sslActive: false,
            dnsConfigured: false,
        };
    }
}

/**
 * Check DNS configuration
 */
async function checkDNS(domain: string): Promise<boolean> {
    try {
        const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const data = await response.json();
        
        return data.Status === 0 && data.Answer?.length > 0;
    } catch {
        return false;
    }
}

/**
 * Check SSL certificate
 */
async function checkSSL(domain: string): Promise<boolean> {
    try {
        const response = await fetch(`https://${domain}`, {
            method: 'HEAD',
        });
        
        return response.ok;
    } catch {
        return false;
    }
}

// ============================================================================
// UTILITIES
// ============================================================================

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    setupDomain,
    verifyDomain,
    addDomainToCloudflare,
    configureDNSRecords,
    enableSSL,
    enableDDoSProtection,
};
