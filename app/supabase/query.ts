import {writeFile} from 'node:fs/promises'
import GithubService from '../github/service.ts'

export default async function createInsertQuery(data:any){
    const {admin, users, languages, repositories, topics, topicsXrepo, licenses} = await parseData(data)
    const tables = [
        {name: 'admin', data: admin},
        {name: 'owner', data: users},
        {name: 'language', data: languages},
        {name: 'repository', data: repositories},
        {name: 'license', data: licenses},
        {name: 'topic', data: topics},
        {name: 'topicXrepository', data: topicsXrepo}
    ]
    let query = ''
    tables.forEach(table => {query += `INSERT INTO ${table.name} VALUES ${table.data};\n`})
    const write = async ()=> {await writeFile('app/test.txt', query, 'utf8')}
    write()
    return query.replaceAll(',)', ')')
}

async function parseData(data: any){
    const admin = plainObject(data.user)
    getCountByTopic(data.reposTopics, data.topicsXrepo)
    let topics = arrayPlain(data.reposTopics)
    let topicsXrepo = arrayPlain(data.topicsXrepo)
    let licenses = arrayPlain(data.licenses)
    let langs = []
    let owners = []
    let repos = []
    
    for(let repo of data.repositories){
        repo.readmeUrl = await parseUrlReadme(repo.name, repo.owner.login)
        const lang = repo.primaryLanguage ?? null
        const owner = repo.owner
        if((lang !== undefined) && (lang !== null)){
            let langExist: boolean = langs.some(l => l.id === lang.id)
            if(langExist === false) langs.push(lang)
            repo.primaryLanguageId = lang.id
        }
        if((owner !== undefined) && (owner !== null)){
            let ownerExist: boolean = owners.some(l => l.id === owner.id)
            if(ownerExist === false) owners.push(owner)
            repo.ownerId = owner.id
        }
        repo.ownerStarredId = data.user.id
        delete repo.owner
        delete repo.primaryLanguage
        repos.push(repo)
    }
    const users = arrayPlain(owners)
    const repositories = arrayPlain(repos)
    const languages = arrayPlain(langs)
    
    return {admin, users, languages, repositories, topics, topicsXrepo, licenses}
}

function getCountByTopic(topics: Array<any>, relation: Array<any>){
    topics.forEach(topic => {
       const founded = topics.filter(tp => tp.id === topic.id)
       topic.stargazerCount = founded.length
    })
}

function arrayPlain(arr: Array<any>){
    const data:any = []
    arr.forEach((item) => {
        let exists = data.some(it => it.id === item.id)
        if(exists === false){
            let str = plainObject(item)
            data.push(str)
        }
    })

    return data.join(', ')
}

function plainObject(obj:any): string {
    let str = '('
    for(let key in obj) {
        let value = obj[key]
        if((typeof value) === 'string'){
            str += `${key}:'${value}',`
        } else {
            str += `${key}:${value},`
        }
    }
    str +=')'

    return str
}

async function parseUrlReadme(reponame:string, ownername:string):Promise<string>{
    const req = await fetch(`https://api.github.com/repos/${reponame}/${ownername}/readme`,{
        headers: {'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`}
    })
    const url = await req.json()
    const rawUrl = url.download_url ?? null
    return rawUrl
}