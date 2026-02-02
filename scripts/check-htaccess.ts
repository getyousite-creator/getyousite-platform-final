import { Client } from 'ssh2';

const conn = new Client();
const config = {
    host: '82.25.96.226',
    port: 65002,
    username: 'u110877386',
    password: '115456Pc@@##..'
};

conn.on('ready', () => {
    // Read .htaccess
    const cmd = 'cat public_html/.htaccess';

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
