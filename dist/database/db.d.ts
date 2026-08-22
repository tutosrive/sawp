export default class DB {
    private URL;
    private client;
    private timeout;
    constructor();
    createTables(callback?: (e: any, r: any) => any): Promise<void>;
    private getClient;
    private handleExecuteTimeout;
    runQuery(queryName: string, query: string, callback?: (e: any, a: any) => any): Promise<void>;
    private runCallback;
    closeClient(): Promise<void>;
}
//# sourceMappingURL=db.d.ts.map