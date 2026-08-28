import DB from '../database/db.js';
import createInsertQuery from './query.js';
import Helpers from '../utils/helpers.js';
import * as core from '@actions/core';
export default async function runs(data) {
    core.info(`Running supabase with data from user "${data.user.login}"`);
    const db = new DB();
    await db.createTables(async (e, r) => {
        await dispatchQueries(data, db, e, r);
    });
}
async function dispatchQueries(data, db, err, res) {
    Helpers.catchResultQuery('Create Database Tables.', err, res, async () => {
        await callOk(data, db);
    });
}
async function callOk(data, db) {
    const queryInserts = await createInsertQuery(data, true);
    const queryName = 'Insert Data Into Tables.';
    await db.runQuery(queryName, queryInserts, async (e, r) => {
        Helpers.catchResultQuery(queryName, e, r);
        db.closeClient();
    });
}
//# sourceMappingURL=run.js.map