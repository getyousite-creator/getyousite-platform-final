import * as ftp from 'basic-ftp';
import { Readable } from 'stream';
import { SiteBlueprint } from '../schemas';

export const FTPDeploymentService = {
    /**
     * PHYSICAL UPLOAD BRIDGE
     * Logic: Uploads the site manifest and assets to the Hostinger public_html.
     */
    async uploadSite(siteId: string, blueprint: SiteBlueprint) {
        const client = new ftp.Client();
        // client.ftp.verbose = true;

        try {
            await client.access({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASS,
                port: parseInt(process.env.FTP_PORT || '21'),
                secure: false
            });

            const remotePath = `${process.env.FTP_ROOT}/${siteId}`;
            await client.ensureDir(remotePath);

            const manifest = JSON.stringify({
                siteId,
                blueprint,
                deployedAt: new Date().toISOString()
            }, null, 2);

            const s = new Readable();
            s.push(manifest);
            s.push(null);

            await client.uploadFrom(s, "manifest.json");
            return { success: true, path: remotePath };
        } finally {
            client.close();
        }
    }
};
