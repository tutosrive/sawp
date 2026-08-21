export default class Helpers{
    static getTopics(repos: any){
        const topics: any[] = []
        const topicsXrepo: any[] = []
        for(let repo of repos){
            const topicsRepo = repo.repositoryTopics
            if(topicsRepo !== undefined && topicsRepo !== null){
                const topicsNode = topicsRepo.nodes
                for (let topic of topicsNode) {
                    const obj = topic.topic
                    if(topics.some((it: any) => it === obj.id) === false){
                        topics.push(obj)
                    }
                    const topicXrepo = this.getTopicXRepo(obj, repo)
                    const existsTopicXRepo = topicsXrepo.some(t => (t.idRepo === topicXrepo.idRepo) && (t.idTopic === topicXrepo.idTopic))
                    if(existsTopicXRepo === false){
                        topicsXrepo.push(topicXrepo)
                    }
                }
            }
            delete repo.repositoryTopics
        }
        return {topics, topicsXrepo}
    }

    static getTopicXRepo(topic: any, repo: any){
        return {
            idRepo: repo.id,
            idTopic: topic.id
        }
    }

    static getLicenses(data: any){
        const licenses: any[] = []
        data.repositories.forEach((repo: any) => {
            repo.licenseId = null
            const licenseInfo = repo.licenseInfo
            if((licenseInfo !== undefined) && (licenseInfo !== null)){
                repo.licenseId = licenseInfo.id
                if(licenses.some(l => l.id === licenseInfo.id) === false) licenses.push(licenseInfo)
            }
            delete repo.licenseInfo
        })
        return licenses
    }

    static catchResultQuery(queryName: string, error: any, result: any, callOk? = null){
        if((error === undefined) || (error === null)){
            console.log(`Query ${queryName} executed successfully`)
            if(result instanceof Array){
                result.forEach(res => {
                    const hasRowCount:Boolean = Object.hasOwn(res, 'rowCount')
                    const hasCommand:Boolean = Object.hasOwn(res, 'command')
                    if(hasRowCount && hasCommand){
                        console.log(`Command: ${res.command}, Row Count: ${res.rowCount}`)
                    }
                })
            }
            if(callOk !== null) callOk()
            return
        }
        console.log(`Error while try execute query: ${queryName}`)
        console.log(error)
    }
}