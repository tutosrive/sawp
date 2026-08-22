export default class Helpers {
    static getTopics(repos: any): {
        topics: any[];
        topicsXrepo: any[];
    };
    static getTopicXRepo(topic: any, repo: any): {
        idRepo: any;
        idTopic: any;
    };
    static getLicenses(data: any): any[];
    static catchResultQuery(queryName: string, error: any, result: any, callOk?: (() => any) | null): void;
}
//# sourceMappingURL=helpers.d.ts.map