import * as github from '@actions/github';
import * as core from '@actions/core';
import { admin, query } from './query.js';
import Helpers from '../utils/helpers.js';
import { type OktokitResponse, StarredRepo, AdminGet } from './models.js';
import { GitHub } from '@actions/github/lib/utils';
import { setTimeout } from 'node:timers/promises';

class GithubService {
    private tk: string | undefined;
    private username: string | undefined;
    private okt: InstanceType<typeof GitHub>;

    constructor() {
        this.tk = process.env.GITHUB_TOKEN;
        this.okt = github.getOctokit(this.tk);
        this.username = process.env.GITHUB_USER;
    }

    async getData(): Promise<OktokitResponse> {
        const PAGE_SIZE = 25;
        const RETRY_DELAY_MS = 5000;
        const MAX_RETRIES = 5;
        const REPOSITORIES: Array<StarredRepo> = [];
        let hasNextPage: boolean = true;
        let data: OktokitResponse;
        let endCursor: string | null = null;
        do {
            let attempt = 0;
            while (true) {
                try {
                    data = await this.okt.graphql(query, { username: this.username, first: PAGE_SIZE, endCursor });
                    REPOSITORIES.push(...data.user.starredRepositories.nodes);
                    const PAGEINFO = data.user.starredRepositories.pageInfo;
                    core.debug(`pageInfo: ${JSON.stringify(PAGEINFO)}`);
                    hasNextPage = PAGEINFO.hasNextPage ?? false;
                    endCursor = PAGEINFO.endCursor;
                    break;
                } catch (e) {
                    attempt += 1;
                    if (!this.isRetryableError(e) || attempt > MAX_RETRIES) {
                        throw e;
                    }

                    const message = e instanceof Error ? e.message : String(e);
                    const delay = Math.min(RETRY_DELAY_MS * 2 ** (attempt - 1), 60000);
                    core.warning(`GitHub request failed (${message}). Retrying in ${delay / 1000} seconds.`);
                    await setTimeout(delay);
                }
            }
        } while (hasNextPage);
        data.repositories = REPOSITORIES;
        core.info(`Has been processed ${REPOSITORIES.length}/${data.user.starredRepositories.totalCount} repositories.`);
        if(data && data.repositories && data.user){
            await this.getAdmin(data);
            return this.parseData(data);
        } else {
            return null
        }
    }

    private isRetryableError(error: unknown): boolean {
        const status = typeof error === 'object' && error !== null && 'status' in error
            ? error.status
            : undefined;
        const message = error instanceof Error ? error.message : String(error);

        return (typeof status === 'number' && [403, 429, 500, 502, 503, 504].includes(status))
            || /rate limit|secondary rate limit|timeout|temporarily unavailable/i.test(message);
    }

    private async getAdmin(data: OktokitResponse) {
        core.info('Getting Admin Data');
        const ADMINDATA: AdminGet = await this.okt.graphql(admin, { username: this.username });
        const TOTAL_COUNT = data.user.starredRepositories.totalCount;
        data.user = ADMINDATA.user;
        data.user.stargazerCount = TOTAL_COUNT;
    }

    private parseData(data: OktokitResponse): OktokitResponse {
        const { topics, topicsXrepo } = Helpers.getTopics(data.repositories);
        data.licenses = Helpers.getLicenses(data);
        data.reposTopics = topics;
        data.topicsXrepo = topicsXrepo;
        return data;
    }
}

export default GithubService;
