import * as github from '@actions/github'
import query from './query.ts'
import Helpers from '../utils/helpers.ts'

export default class GithubService {
    private tk: string
    private username: string
    private okt
    
    constructor(){
        this.tk = process.env.GITHUB_TOKEN
        this.okt = github.getOctokit(this.tk)
        this.username = process.env.GITHUB_USER
    }
    
    async getData(){
        const data = await this.okt.graphql(query, {username: this.username, first:1})
        return this.parseData(data)
    }

    private parseData(data){
        data.user.stargazerCount = data.user.starredRepositories.totalCount
        data.repositories = data.user.starredRepositories.nodes
        delete data.user.starredRepositories
        const {topics, topicsXrepo} = Helpers.getTopics(data.repositories)
        data.licenses = Helpers.getLicenses(data)
        data.reposTopics = topics
        data.topicsXrepo = topicsXrepo
        return data
    }
}