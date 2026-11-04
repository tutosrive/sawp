import * as core from '@actions/core';
import { getEnvVars } from './utils/env.utils.js';
import rung from './github/run.js';
import runs from './supabase/run.js';
import { type OktokitResponse } from './github/models.js';
import { clearGithubCache } from './github/cache.js';

async function run() {
    try {
        getEnvVars();
        const data: OktokitResponse = await rung();
        if (data && data.user && data.repositories) {
            core.info(`Will be processed "${data.user.stargazerCount} repositories" and sent it to you database.`);
            await runs(data);
            await clearGithubCache();
            core.info('Github cache cleared after successful insertion.');
        } else {
            throw new Error('Data is not valid, missing user and repositories, check username and try again.');
        }
    } catch (e) {
        core.error(`Has happend an error getting Data: ${e}`);
    }
}

await run();
