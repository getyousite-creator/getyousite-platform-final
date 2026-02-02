import * as ftp from 'basic-ftp';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars strictly
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyConnection() {
    console.log("🔍 CONNECTION_PROBE: Initiating strict credential test...");

    // 1. Audit Environment Variables
    const host = process.env.FTP_HOST;
    const user = process.env.FTP_USER;
    const pass = process.env.FTP_PASS;
    const secure = false; // Hostinger FTP is often plain FTP on port 21

    console.log(`📋 CONFIGURATION:`);
    console.log(`   - HOST: ${host}`);
    console.log(`   - USER: ${user}`);
    console.log(`   - PORT: 21`);
    console.log(`   - PASS: ${pass ? '******' : 'MISSING'}`);

    if (!host || !user || !pass) {
        throw new Error("❌ CRITICAL: Missing FTP credentials in .env.local");
    }

    const client = new ftp.Client();
    client.ftp.verbose = true; // Enable low-level logs

    try {
        console.log("🔌 CONNECTING...");
        await client.access({
            host,
            user,
            password: pass,
            secure: secure,
            port: 21
        });

        console.log("✅ AUTHENTICATION: SUCCESS");

        console.log("📂 VERIFYING ROOT PATH...");
        const rootPath = process.env.FTP_ROOT || '/domains/getyousite.com/public_html';
        await client.cd(rootPath);
        console.log(`✅ PATH RESOLVED: ${rootPath}`);

        console.log("📝 TESTING WRITE PERMISSIONS...");
        const testFile = 'probe_connectivity.txt';
        const { Readable } = require('stream');
        const stream = Readable.from([Buffer.from('Connection Verified')]);
        await client.uploadFrom(stream, testFile);
        console.log("✅ UPLOAD TEST: SUCCESS");
        await client.remove(testFile);
        console.log("✅ CLEANUP: SUCCESS");

        console.log("\n🎉 RESULT: AUTOMATION IS POSSIBLE.");
        console.log("   The credentials are valid. We can proceed to build the Deploy-Bot.");

    } catch (error: any) {
        console.error("\n❌ CONNECTION FAILED (The Absolute Truth):");
        console.error(`   ERROR CODE: ${error.code}`);
        console.error(`   MESSAGE: ${error.message}`);

        if (error.code === 530) {
            console.error("\n🛑 DIAGNOSIS: WRONG PASSWORD or USERNAME.");
            console.error("   Solution: You MUST update FTP_PASS or FTP_USER in .env.local");
            console.error("   Note: Ensure the username matches EXACTLY what is in Hostinger (e.g. u123456 vs u123456.domain.com)");
        }
        process.exit(1);
    } finally {
        client.close();
    }
}

verifyConnection();
