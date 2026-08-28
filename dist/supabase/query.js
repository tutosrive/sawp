export default async function createInsertQuery(data, isFirst = false) {
    const { admin, users, languages, repositories, topics, topicsXrepo, licenses } = await parseData(data);
    const tables = [
        { name: 'owner', data: users },
        { name: 'language', data: languages },
        { name: 'license', data: licenses },
        { name: 'topic', data: topics },
        { name: 'repository', data: repositories },
        { name: 'topicXrepository', data: topicsXrepo },
    ];
    isFirst === true ? tables.unshift({ name: 'admin', data: admin }) : null;
    let query = '';
    tables.forEach((table) => {
        if (table.data.length > 0) {
            query += `INSERT INTO ${table.name} VALUES ${table.data};\n`;
        }
    });
    query = query.replaceAll(',)', ')');
    return query;
}
async function parseData(data) {
    const admin = plainObject(data.user);
    getCountByTopic(data.reposTopics, data.topicsXrepo);
    let topics = arrayPlain(data.reposTopics, true);
    let topicsXrepo = arrayPlain(data.topicsXrepo, false);
    let licenses = arrayPlain(data.licenses, true);
    let langs = [];
    let owners = [];
    let repos = [];
    for (let repo of data.repositories) {
        const defaultBranchName = repo.defaultBranchRef.name;
        delete repo.defaultBranchRef;
        repo.readmeUrl = await parseUrlReadme(repo.name, repo.owner.login, defaultBranchName);
        const lang = repo.primaryLanguage ?? null;
        repo.primaryLanguageId = null;
        const owner = repo.owner;
        if (lang !== undefined && lang !== null) {
            let langExist = langs.some((l) => l.id === lang.id);
            if (langExist === false)
                langs.push(lang);
            repo.primaryLanguageId = lang.id;
        }
        if (owner !== undefined && owner !== null) {
            let ownerExist = owners.some((l) => l.id === owner.id);
            if (ownerExist === false)
                owners.push(owner);
            repo.ownerId = owner.id;
        }
        repo.ownerStarredId = data.user.id;
        delete repo.owner;
        delete repo.primaryLanguage;
        repos.push(repo);
    }
    const users = arrayPlain(owners, true);
    const repositories = arrayPlain(repos, true);
    const languages = arrayPlain(langs, true);
    return { admin, users, languages, repositories, topics, topicsXrepo, licenses };
}
function getCountByTopic(topics, relation) {
    topics.forEach((topic) => {
        const founded = relation.filter((tp) => tp.idTopic === topic.id);
        topic.stargazerCount = founded.length;
    });
}
function arrayPlain(arr, unique = true) {
    const data = [];
    const strData = [];
    arr.forEach((item) => {
        let exists = unique === false ? false : data.some((it) => it.id === item.id);
        if (exists === false) {
            data.push(item);
            let str = plainObject(item);
            strData.push(str);
        }
    });
    return strData.join(', ');
}
function plainObject(obj) {
    let str = '(';
    for (let value of Object.values(obj)) {
        if (typeof value === 'string') {
            str += `$$${value}$$,`;
            continue;
        }
        str += `${value},`;
    }
    str += ')';
    return str;
}
async function parseUrlReadme(reponame, ownername, branch) {
    const rawUrl = `https://raw.githubusercontent.com/${ownername}/${reponame}/${branch}/README.md`;
    return rawUrl;
}
//# sourceMappingURL=query.js.map