import { type OktokitResponse } from './models.js';
declare class GithubService {
    private tk;
    private username;
    private okt;
    constructor();
    getData(): Promise<OktokitResponse>;
    private parseData;
}
export default GithubService;
//# sourceMappingURL=service.d.ts.map