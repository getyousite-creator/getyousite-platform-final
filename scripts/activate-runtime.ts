import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';

const conn = new Client();
const config = {
    host: process.env.SSH_HOST!,
    port: parseInt(process.env.SSH_PORT!),
    username: process.env.SSH_USER!,
    password: process.env.SSH_PASS!
};

const REMOTE_ROOT = '/public_html'; // Hostinger shared usually maps user root to ~
// Ideally we want to be in ~/public_html or domains/.../public_html
// Let's assume the user lands in ~, and public_html is there.
// The user previous FTP said remotePath: /public_html

conn.on('ready', () => {
    console.log('SSH_CONNECTION: ESTABLISHED.');

    // Series of commands to run
    // FIX: Source NVM and bashrc to ensure Node/PM2 are in PATH for non-interactive shell
    const envSetup = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && source ~/.bashrc`;

    const commands = [
        `${envSetup} && echo "DIAGNOSTIC: Checking Environment..."`,
        'pwd',
        'ls -la',
        `cd ${process.env.FTP_ROOT || 'domains/getyousite.com/public_html'} || echo "ERROR: Could not find deployment directory"`,
        'pwd',
        // PROXY CONFIGURATION (Standard Hostinger Node.js)
        'echo "RewriteEngine On" > .htaccess',
        'echo "RewriteRule ^$ http://127.0.0.1:3000/ [P,L]" >> .htaccess',
        'echo "RewriteCond %{REQUEST_FILENAME} !-f" >> .htaccess',
        'echo "RewriteCond %{REQUEST_FILENAME} !-d" >> .htaccess',
        'echo "RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]" >> .htaccess',
        'cat .htaccess',
        // DIAGNOSTICS
        'node -v',
        'npm -v',
        // Check for server.js
        'ls -la server.js',
        // INSTALL DEPENDENCIES (Critical for arch mismatches)
        'echo "DEPENDENCY_CHECK: Installing production modules..."',
        'npm install --production',
        // Start application
        // Check if PM2 is installed
        'pm2 -v || (echo "PM2_MISSING: Installing PM2..." && npm install -g pm2)',
        // Start
        'echo "IGNITION: Starting Server..."',
        'pm2 delete getyousite-platform || echo "No previous instance"',
        'PORT=3000 pm2 start server.js --name "getyousite-platform"',
        'pm2 save',
        'pm2 list'
    ];

    const fullCommand = commands.join(' && ');

    console.log(`EXECUTING_SEQUENCE: ${fullCommand}`);

    conn.exec(fullCommand, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code: any, signal: any) => {
            console.log(`SSH_SESSION: Closed. Code: ${code}, Signal: ${signal}`);
            conn.end();
            if (code !== 0) process.exit(1);
        }).on('data', (data: any) => {
            process.stdout.write('STDOUT: ' + data);
        }).stderr.on('data', (data: any) => {
            process.stderr.write('STDERR: ' + data);
        });
    });
}).connect(config);

conn.on('error', (err) => {
    console.error('SSH_CONNECTION_ERROR:', err);
    process.exit(1);
});
