import GithubService from './service.ts'

export default async function rung(){
    console.log('Running github ...')
    const service = new GithubService()
    return await service.getData()
}