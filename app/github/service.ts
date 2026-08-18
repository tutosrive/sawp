import * as github from '@actions/github'
import query from './query.ts'

export default class GithubService {
    private tk: string
    private username: string

    constructor(){
        this.tk = process.env.GITHUB_TOKEN
        this.username = process.env.GITHUB_USER
    }
    
    async getData(){
        const okt = github.getOctokit(this.tk)
        const data = await okt.graphql(query, {username: this.username, first:5})
        return this.parseData(data)
    }

    private parseData(data){
        data.repositories = data.user.starredRepositories.nodes
        delete data.user.starredRepositories
        return data
    }
}