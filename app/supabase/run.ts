import DB from '../database/db.js';
import createInsertQuery from './query.js';
import * as core from '@actions/core';
import { type OktokitResponse } from '../github/models.js';

export default async function runs(data: OktokitResponse) {
    core.info(`Running supabase with data from user "${data.user.login}"`);
    const db = new DB();
    try {
        const tablesResult = await db.createTables();
        core.info('Query "Create Database Tables." executed successfully');
        core.debug(`Create tables result: ${JSON.stringify(tablesResult)}`);

        const queryInserts = await createInsertQuery(data, true);
        const insertResult = await db.runQuery('Insert Data Into Tables.', queryInserts);
        core.info('Query "Insert Data Into Tables." executed successfully');
        core.debug(`Insert result: ${JSON.stringify(insertResult)}`);
    } finally {
        await db.closeClient();
    }
}
