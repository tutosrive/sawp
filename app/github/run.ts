import GithubService from './service.ts'
import * as core from '@actions/core'

export default async function rung(){
    core.debug('Getting Github Data.')
    const service = new GithubService()
    return await service.getData()
}