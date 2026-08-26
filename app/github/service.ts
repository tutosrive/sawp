import * as github from '@actions/github';
import * as core from '@actions/core';
import { admin, query } from './query.js';
import Helpers from '../utils/helpers.js';
import { type OktokitResponse, type Admin, StarredRepo } from './models.js';
import { GitHub } from '@actions/github/lib/utils';

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
        const repositories: Array<StarredRepo> = [];
        let hasNextPage: boolean = true;
        let data: OktokitResponse;
        let endCursor: string | null = null;

        // TODO: Add a timeout to save github api limits (anyway get it a 502 ERROR)
        do {
            const data: OktokitResponse = await this.okt.graphql(query, { username: this.username, first: 100, endCursor });
            repositories.push(...data.user.starredRepositories.nodes);
            const pageInfo = data.user.starredRepositories.pageInfo;
            core.info(JSON.stringify(pageInfo));
            hasNextPage = pageInfo.hasNextPage ?? false;
            endCursor = pageInfo.endCursor;
        } while (hasNextPage);
        this.getAdmin(data);
        return this.parseData(data);
    }

    private async getAdmin(data: OktokitResponse) {
        const adminData: Admin = await this.okt.graphql(admin, { username: this.username });
        data.user = adminData;
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
