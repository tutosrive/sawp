import {writeFile} from 'node:fs/promises'
import GithubService from '../github/service.ts'

export default async function createInsertQuery(data:any, isFirst?: boolean = false): Promise<string> {
    const {admin, users, languages, repositories, topics, topicsXrepo, licenses} = await parseData(data)
    const tables = [
        {name: 'owner', data: users},
        {name: 'language', data: languages},
        {name: 'license', data: licenses},
        {name: 'topic', data: topics},
        {name: 'repository', data: repositories},
        {name: 'topicXrepository', data: topicsXrepo}
    ]
    isFirst === true ? tables.unshift({name: 'admin', data: admin}) : null
    let query: string = ''
    tables.forEach(table => {
        if(table.data.length > 0){
            query += `INSERT INTO ${table.name} VALUES ${table.data};\n`
        }
    })
    query = query.replaceAll(',)', ')')
    const write = async ()=> {await writeFile('app/queries.sql', query, 'utf8')}
    write()
    return query
}

async function parseData(data: any){
    const admin = plainObject(data.user)
    getCountByTopic(data.reposTopics, data.topicsXrepo)
    let topics = arrayPlain(data.reposTopics, true)
    let topicsXrepo = arrayPlain(data.topicsXrepo, false)
    let licenses = arrayPlain(data.licenses, true)
    let langs = []
    let owners = []
    let repos = []
    
    for(let repo of data.repositories){
        repo.readmeUrl = await parseUrlReadme(repo.name, repo.owner.login)
        const lang = repo.primaryLanguage ?? null
        repo.primaryLanguageId = null
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
    const users = arrayPlain(owners, true)
    const repositories = arrayPlain(repos, true)
    const languages = arrayPlain(langs, true)
    
    return {admin, users, languages, repositories, topics, topicsXrepo, licenses}
}

function getCountByTopic(topics: Array<any>, relation: Array<any>){
    topics.forEach(topic => {
       const founded = topics.filter(tp => tp.id === topic.id)
       topic.stargazerCount = founded.length
    })
}

function arrayPlain(arr: Array<any>, unique?: boolean = true){
    const data:Array<any> = []
    const strData = []
    const test = []
    arr.forEach((item) => {
        let exists = unique === false ? false : data.some((it, i, a) => it.id == item.id)
        if(exists === false){
            data.push(item)
            let str = plainObject(item)
            test.push(plainObjectT(item))
            strData.push(str)
        }
    })
    const write = async()=>{
        await writeFile(`app/data/data-json-${data[0].id}.json`, JSON.stringify(data, null, 4))
        await writeFile(`app/data/data-array-${data[0].id}.json`, JSON.stringify(test, null, 4))
    }
    write()
    return strData.join(', ')
}

function plainObjectT(obj){
    const a = []
    for(let key in obj) {
        let value = obj[key] ?? null
        if((typeof value) === 'string'){
            a.push(`$$${key}: ${value}$$,`)
            continue
        }
        a.push(`${key}: ${value},`)
    }
    return a
}

function plainObject(obj:any): string {
    let str = '('
    for(let key in obj) {
        let value = obj[key] ?? null
        if((typeof value) === 'string'){
            str += `$$${value}$$,`
            continue
        }
        str += `${value},`
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