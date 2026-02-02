import { Client } from 'ssh2';

const conn = new Client();
const config = {
    host: '82.25.96.226',
    port: 65002,
    username: 'u110877386',
    password: '115456Pc@@##..'
};

conn.on('ready', () => {
    // FIX: Source env
    const envSetup = `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"`;

    // Debug: Check .htaccess and run PHP
    const cmd = `cat public_html/.htaccess && echo "---" && php public_html/vitality.php`;

    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code: any, signal: any) => {
            conn.end();
            process.exit(0);
        }).on('data', (data: any) => {
            process.stdout.write(data);
        }).stderr.on('data', (data: any) => {
            process.stderr.write(data);
        });
    });
}).connect(config);
