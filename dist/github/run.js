import GithubService from './service.js';
import * as core from '@actions/core';
export default async function rung() {
    core.info('Getting Github Data.');
    const service = new GithubService();
    return await service.getData();
}
//# sourceMappingURL=run.js.map