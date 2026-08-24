import { Client } from 'pg';
import { readFile } from 'node:fs/promises';
import * as core from '@actions/core';

export default class DB {
    private URL: string;
    private client;
    private timeout;

    constructor() {
        this.URL = process.env.DB_CONNECTION_URL;
        this.getClient();
    }

    async createTables(callback?: (e: any, r: any) => any) {
        const tables: string = await readFile('app/database/tables.sql', 'utf8');
        const req = async () => {
            this.runQuery('Creating Database Tables', tables, callback);
        };
        this.handleExecuteTimeout(req, 5000);
    }

    private async getClient() {
        core.info('Getting Postgres Client');
        this.client = await new Client({ connectionString: this.URL }).connect();
    }

    private handleExecuteTimeout(callback: () => any, time: number = 2000) {
        const tmot: any = setTimeout(() => {
            callback();
            clearTimeout(tmot);
        }, time);
    }

    async runQuery(queryName: string, query: string, callback?: (e: any, a: any) => any) {
        const req = async () => {
            const q = { text: query };
            core.info(`Executing query: ${queryName}`);
            await this.client.query(q, (err: any, res: any) => {
                if (callback !== undefined) callback(err, res);
                else console.log(`Query Executed: ${queryName}`);
            });
        };
        this.runCallback(req, 5000);
    }

    private runCallback(req: () => any, time: number) {
        if (this.client === undefined || this.client === null) {
            this.handleExecuteTimeout(req, time);
        } else {
            req();
        }
    }

    async closeClient() {
        if (this.client !== null || this.client !== undefined) {
            await this.client.end();
        }
    }
}
