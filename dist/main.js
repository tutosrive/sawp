import * as core from '@actions/core';
import { getEnvVars } from './utils/env.utils.js';
import rung from './github/run.js';
async function run() {
    try {
        getEnvVars();
        console.log('running');
        const data = await rung();
        if (data.user && data.repositories) {
            core.info(`Will be processed "${data.user.stargazerCount} repositories".`);
            // await runs(data);
        }
        else {
            throw new Error('Data is not valid, missing user and repositories, check username and try again.');
        }
    }
    catch (e) {
        core.error(`Has happend an error getting Data: ${e}`);
    }
}
await run();
//# sourceMappingURL=main.js.map