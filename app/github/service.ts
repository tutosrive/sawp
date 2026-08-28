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
        const TIMEOUT_SECONDS = 10;
        const TIMEOUT = TIMEOUT_SECONDS * 1000;
        const REPOSITORIES: Array<StarredRepo> = [];
        let hasNextPage: boolean = true;
        let data: OktokitResponse;
        let endCursor: string | null = null;
        do {
            try {
                data = await this.okt.graphql(query, { username: this.username, first: 100, endCursor });
                REPOSITORIES.push(...data.user.starredRepositories.nodes);
                const PAGEINFO = data.user.starredRepositories.pageInfo;
                core.debug(`pageInfo: ${JSON.stringify(PAGEINFO)}`);
                hasNextPage = PAGEINFO.hasNextPage ?? false;
                endCursor = PAGEINFO.endCursor;
            } catch (e) {
                const MSG = `GitHub Limit Reached; ${REPOSITORIES.length}/${data.user.starredRepositories.totalCount} repositories, wait ${TIMEOUT_SECONDS} seconds`;
                core.info(MSG);
                const aw = await setTimeout(TIMEOUT, `API limit has been restaured after ${TIMEOUT_SECONDS} seconds.`);
                core.info(aw);
            }
        } while (hasNextPage);
        data.repositories = REPOSITORIES;
        core.info(`Has been processed ${REPOSITORIES.length}/${data.user.starredRepositories.totalCount} repositories.`);
        await this.getAdmin(data);
        return this.parseData(data);
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
