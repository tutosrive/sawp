import * as github from '@actions/github'
import query from './query.ts'

export default class GithubService {
    private tk: string

    constructor(){
        this.tk = process.env.GITHUB_TOKEN
    }
    
    async getData(){
        const okt = github.getOctokit(this.tk)
        const data = await okt.graphql(query, {username:'tutosrive', first:5})
        return data
    }
}