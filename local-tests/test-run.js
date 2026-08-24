import { exec } from 'node:child_process';
import console, { error, log } from 'node:console';

const vars = [
    { name: 'INPUT_GITHUB-USER', value: process.env.GITHUB_USER },
    { name: 'INPUT_GITHUB-TOKEN', value: process.env.GITHUB_TOKEN },
    { name: 'INPUT_DB-CONNECTION-URL', value: process.env.DB_CONNECTION_URL },
];

let exports = [];

vars.forEach((v) => {
    exports.push(`set ${v.name}=${v.value}`);
});

const command = `${exports.join(' && ')} && node ./dist/index.js`;
exec(command, (e, std, stderr) => {
    if (e) {
        console.log('[ERROR]', e.message);
        return;
    }

    if (stderr) {
        console.log('[STDERR] ', stderr);
        return;
    }

    console.log(`[OK] ${std}`);
});
