import * as github from '@actions/github';
import { admin, query } from './query.js';
import Helpers from '../utils/helpers.js';
import { writeFile } from 'node:fs/promises';
class GithubService {
    tk;
    username;
    okt;
    constructor() {
        this.tk = process.env.GITHUB_TOKEN;
        this.okt = github.getOctokit(this.tk);
        this.username = process.env.GITHUB_USER;
    }
    async getData() {
        const repositories = [];
        let hasNextPage = true;
        let data;
        let endCursor = null;
        console.log('Before all');
        let count = 0;
        // TODO: Add a timeout to save github api limits (anyway get it a 502 ERROR)
        do {
            console.log('Before try get data.');
            try {
                data = await this.okt.graphql(query, { username: this.username, first: 100, endCursor });
                repositories.push(...data.user.starredRepositories.nodes);
                const pageInfo = data.user.starredRepositories.pageInfo;
                console.log(JSON.stringify(pageInfo));
                hasNextPage = pageInfo.hasNextPage ?? false;
                endCursor = pageInfo.endCursor;
            }
            catch (e) {
                console.log(`Error: ${e}`);
                // await setTimeout(5000, 'API limit has been restaured after 5 seconds.');
            }
            if (count == 2) {
                hasNextPage = false;
            }
            count++;
        } while (hasNextPage);
        this.getAdmin(data);
        await writeFile('./data.json', JSON.stringify(data, null, 4));
        return this.parseData(data);
    }
    async getAdmin(data) {
        const adminData = await this.okt.graphql(admin, { username: this.username });
        data.user = adminData;
    }
    parseData(data) {
        data.user.stargazerCount = data.user.starredRepositories.totalCount;
        data.repositories = data.user.starredRepositories.nodes;
        delete data.user.starredRepositories;
        const { topics, topicsXrepo } = Helpers.getTopics(data.repositories);
        data.licenses = Helpers.getLicenses(data);
        data.reposTopics = topics;
        data.topicsXrepo = topicsXrepo;
        return data;
    }
}
export default GithubService;
//# sourceMappingURL=service.js.map