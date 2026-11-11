export default class DB {
    private URL;
    private client;
    constructor();
    createTables(): Promise<import("pg").QueryResult<any>>;
    private getClient;
    runQuery(queryName: string, query: string): Promise<import("pg").QueryResult<any>>;
    closeClient(): Promise<void>;
}
//# sourceMappingURL=db.d.ts.map