const fs = require('fs');
const jetpack = require('fs-jetpack');
const path = require('path');
const client = require('ssh2-sftp-client');

const hosts = require('./hosts');

let sftp = new client();
let datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

function moveDbs() {
    const src = './dbs/temp';
    const dest = './dbs';

    // jetpack.remove(dest + '/*.db'); // This removes old dbs from dest 
    jetpack.find(src, { matching: '*.db' }).forEach((file) => {
        jetpack.moveAsync(file, dest + '/' + path.basename(file), { overwrite: true });
    });
}

async function getDbs() {
    for (const [key, value] of Object.entries(hosts)) {
        try {
            await sftp.connect({
                host: value.ip,
                port: '22',
                username: value.user,
                password: value.password,
            });
            console.log(`${datetime} - Connected to ${key}`);
            await sftp.get(value.path, fs.createWriteStream('./dbs/temp/' + key + '.db'));
            console.log(`${datetime} - Downloaded ${key}.db`);
            await sftp.end();
            console.log(`${datetime} - Disconnected from ${key}`);
        } catch (err) {
            console.log(err, 'catch error');
        }
    }
    moveDbs();
}

module.exports = { getDbs };