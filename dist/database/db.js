import { Client } from 'pg';
import { readFile } from 'node:fs/promises';
import * as core from '@actions/core';
export default class DB {
    URL;
    client;
    timeout;
    constructor() {
        this.URL = process.env.DB_CONNECTION_URL;
        this.getClient();
    }
    async createTables(callback) {
        const tables = await readFile('app/database/tables.sql', 'utf8');
        const req = async () => {
            this.runQuery('Creating Database Tables', tables, callback);
        };
        this.handleExecuteTimeout(req, 5000);
    }
    async getClient() {
        core.info('Getting Postgres Client');
        this.client = await new Client({ connectionString: this.URL }).connect();
    }
    handleExecuteTimeout(callback, time = 2000) {
        const tmot = setTimeout(() => {
            callback();
            clearTimeout(tmot);
        }, time);
    }
    async runQuery(queryName, query, callback) {
        const req = async () => {
            const q = { text: query };
            core.info(`Executing query: ${queryName}`);
            await this.client.query(q, (err, res) => {
                if (callback !== undefined)
                    callback(err, res);
                else
                    console.log(`Query Executed: ${queryName}`);
            });
        };
        this.runCallback(req, 5000);
    }
    runCallback(req, time) {
        if (this.client === undefined || this.client === null) {
            this.handleExecuteTimeout(req, time);
        }
        else {
            req();
        }
    }
    async closeClient() {
        if (this.client !== null || this.client !== undefined) {
            await this.client.end();
        }
    }
}
//# sourceMappingURL=db.js.map