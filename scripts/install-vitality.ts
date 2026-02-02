import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

const conn = new Client();
const config = {
    host: '82.25.96.226',
    port: 65002,
    username: 'u110877386',
    password: '115456Pc@@##..'
};

const localScript = path.resolve(__dirname, 'keepalive.sh');

conn.on('ready', () => {
    console.log('VITALITY_INSTALL: Connected. Uploading heartbeat script...');

    conn.sftp((err, sftp) => {
        if (err) throw err;

        const readStream = fs.createReadStream(localScript);
        const writeStream = sftp.createWriteStream('vitality.sh');

        writeStream.on('close', () => {
            console.log("VITALITY_INSTALL: Script uploaded. Configuring Crontab...");

            // 1. Make executable
            // 2. Add to Crontab (Run every minute)
            // Logic: Check existing cron, append if not present
            const cronJob = "* * * * * /bin/bash /home/u110877386/vitality.sh >> /home/u110877386/vitality_cron.log 2>&1";

            const cmd = `chmod +x vitality.sh && (crontab -l 2>/dev/null; echo "${cronJob}") | sort -u | crontab - && crontab -l`;

            conn.exec(cmd, (err, stream) => {
                if (err) throw err;
                stream.on('close', (code: any) => {
                    console.log(`VITALITY_INSTALL: Crontab updated. Code: ${code}`);
                    conn.end();
                    process.exit(code === 0 ? 0 : 1);
                }).on('data', (data: any) => {
                    process.stdout.write('STDOUT: ' + data);
                }).stderr.on('data', (data: any) => {
                    process.stderr.write('STDERR: ' + data);
                });
            });
        });

        readStream.pipe(writeStream);
    });
}).connect(config);
