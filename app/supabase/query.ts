import {writeFile} from 'node:fs/promises'

export default async function createInsertQuery(data){
    const tables = ['admin', 'user', 'language', 'repository']
    const {admin, users, languages, repositories} = parseData(data)
    let query = `INSERT INTO admin VALUES ${admin};
    INSERT INTO user VALUES ${users};
    INSERT INTO language VALUES ${languages};
    INSERT INTO repository VALUES ${repositories};`
    await writeFile('app/test.txt', query, 'utf8')
    
}

function parseData(data){
    const admin = plainObject(data.user)
    let langs = []
    let owners = []
    let repos = []
    
    for(let repo of data.repositories){
        const lang = repo.primaryLanguage
        const owner = repo.owner
        if(lang !== undefined && lang !== null){
            let langExist: boolean = langs.some(l => l.id === lang.id)
            if(langExist === false) langs.push(lang)
            repo.primaryLanguageId = lang.id
        }
        if(owner !== undefined && owner !== null){
            let ownerExist: boolean = owners.some(l => l.id === owner.id)
            if(ownerExist === false) owners.push(owner)
            repo.ownerId = owner.id
        }
        delete repo.owner
        delete repo.primaryLanguage
        repos.push(repo)
    }
    const users = arrayPlain(owners)
    const repositories = arrayPlain(repos)
    const languages = arrayPlain(langs)

    return {admin, users, languages, repositories}
}

function arrayPlain(arr){
    const data = []
    arr.forEach((item) => {
        let exists = data.some(it => it.id === item.id)
        if(exists === false){
            let str = plainObject(item)
            data.push(str)
        }
    })

    return data.join(', ')
}

function plainObject(obj): string {
    let str = '('
    for(let key in obj) {
        let value = obj[key]
        if((typeof value) === 'string'){
            str += `'${value}',`
        } else {
            str += `${value},`
        }
    }
    str +=')'

    return str
}