import DB from '../database/db.js';
import createInsertQuery from './query.js';
import Helpers from '../utils/helpers.js';
import * as core from '@actions/core';
import { type OktokitResponse } from '../github/models.js';

export default async function runs(data: OktokitResponse) {
    core.debug(`Running supabase with data from user "${data.user.login}"`);
    const db = new DB();
    await db.createTables(async (e: any, r: any) => {
        await dispatchQueries(data, db, e, r);
    });
}

async function dispatchQueries(data: OktokitResponse, db: DB, err: any, res: any) {
    Helpers.catchResultQuery('Create Database Tables.', err, res, async () => {
        await callOk(data, db);
    });
}

async function callOk(data: OktokitResponse, db: DB) {
    const queryInserts: string = await createInsertQuery(data, true);
    const queryName = 'Insert Data Into Tables.';
    await db.runQuery(queryName, queryInserts, async (e: any, r: any) => {
        Helpers.catchResultQuery(queryName, e, r);
        db.closeClient();
    });
}
