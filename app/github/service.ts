import * as github from '@actions/github';
import * as core from '@actions/core';
import { admin, query } from './query.js';
import Helpers from '../utils/helpers.js';
import { type OktokitResponse, type Admin, StarredRepo } from './models.js';
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
        const TIMEOUT = 10000;
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
                core.info(`GitHub Limit Reached, wait ${TIMEOUT} seconds`);
                const aw = await setTimeout(TIMEOUT, `API limit has been restaured after ${TIMEOUT} seconds.`);
                core.info(aw);
            }
        } while (hasNextPage);
        this.getAdmin(data);
        core.info(`Has been processed ${REPOSITORIES.length}/${data.user.starredRepositories.totalCount} repositories.`);
        return this.parseData(data);
    }

    private async getAdmin(data: OktokitResponse) {
        core.info('Getting Admin Data');
        const ADMINDATA: Admin = await this.okt.graphql(admin, { username: this.username });
        data.user = ADMINDATA;
    }

    private parseData(data: OktokitResponse): OktokitResponse {
        data.user.stargazerCount = data.user.starredRepositories!!.totalCount;
        data.repositories = data.user.starredRepositories!!.nodes;
        delete data.user.starredRepositories;
        const { topics, topicsXrepo } = Helpers.getTopics(data.repositories);
        data.licenses = Helpers.getLicenses(data);
        data.reposTopics = topics;
        data.topicsXrepo = topicsXrepo;
        return data;
    }
}

export default GithubService;
