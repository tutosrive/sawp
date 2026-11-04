import { Client } from 'pg';
import { readFile } from 'node:fs/promises';
import * as core from '@actions/core';
import path from 'node:path';

export default class DB {
    private URL: string;
    private client: Promise<Client>;

    constructor() {
        this.URL = process.env.DB_CONNECTION_URL;
        this.client = this.getClient();
    }

    async createTables() {
        const actionPath = process.env.GITHUB_ACTION_PATH ?? process.cwd();
        const tablesPath = path.join(actionPath, 'app', 'database', 'tables.sql');
        const tables: string = await readFile(tablesPath, 'utf8');
        return this.runQuery('Creating Database Tables', tables);
    }

    private async getClient(): Promise<Client> {
        core.info('Getting Postgres Client');
        const client = new Client({ connectionString: this.URL });
        await client.connect();
        return client;
    }

    async runQuery(queryName: string, query: string) {
        const client = await this.client;
        const q = { text: query };
        core.info(`Executing query: ${queryName}`);
        return client.query(q);
    }

    async closeClient() {
        const client = await this.client;
        await client.end();
    }
}
