import * as github from '@actions/github';
import query from './query.js';
import Helpers from '../utils/helpers.js';
import { type OktokitResponse } from './models.js';

class GithubService {
    private tk: string;
    private username: string | undefined;
    private okt;

    constructor() {
        this.tk = process.env.GITHUB_TOKEN;
        this.okt = github.getOctokit(this.tk);
        this.username = process.env.GITHUB_USER;
    }

    async getData(): Promise<OktokitResponse> {
        const data: OktokitResponse = await this.okt.graphql(query, { username: this.username, last: 100 });
        return this.parseData(data);
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
