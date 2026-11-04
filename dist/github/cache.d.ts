import { type OktokitResponse } from './models.js';
export declare function readGithubCache(): Promise<OktokitResponse | null>;
export declare function writeGithubCache(data: OktokitResponse): Promise<void>;
export declare function clearGithubCache(): Promise<void>;
//# sourceMappingURL=cache.d.ts.map