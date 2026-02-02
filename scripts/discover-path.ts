import * as ftp from 'basic-ftp';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function discoverPath() {
    console.log("🕵️ PATH_DISCOVERY: Starting root scan...");
    const client = new ftp.Client();
    // client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        });

        console.log("✅ AUTH SUCCESS.");

        // List root
        console.log("📂 Listing '/' contents:");
        const rootList = await client.list('/');
        rootList.forEach(f => console.log(`   - ${f.name} [${f.isDirectory ? 'DIR' : 'FILE'}]`));

        // Try 'domains' if exists
        const domains = rootList.find(f => f.name === 'domains');
        if (domains) {
            console.log("\n📂 Listing '/domains' contents:");
            const domainList = await client.list('/domains');
            domainList.forEach(f => console.log(`   - ${f.name}`));
        } else {
            console.log("\n❓ 'domains' folder not found in root. Checking for public_html directly...");
            const publicHtml = rootList.find(f => f.name === 'public_html');
            if (publicHtml) {
                console.log("✅ FOUND 'public_html' in root!");
            }
        }

    } catch (err) {
        console.error("❌ ERROR:", err);
    } finally {
        client.close();
    }
}

discoverPath();
