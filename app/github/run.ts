import GithubService from './service.ts'

export default async function rung(){
    console.log('Running github ...')
    const service = new GithubService()
    const data = await service.getData()
    console.log(data)
}