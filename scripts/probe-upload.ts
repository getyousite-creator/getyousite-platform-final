import { Client } from 'ssh2';

const conn = new Client();
const config = {
    host: '82.25.96.226',
    port: 65002,
    username: 'u110877386',
    password: '115456Pc@@##..'
};

conn.on('ready', () => {
    // Check file count in public_html
    conn.exec('find ~/public_html -maxdepth 2 | wc -l', (err, stream) => {
        if (err) throw err;
        stream.on('data', (data: any) => {
            console.log(`FILE_COUNT: ${data.toString().trim()}`);
        }).on('close', () => conn.end());
    });
}).connect(config);
