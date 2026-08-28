import * as core from '@actions/core';
export default class Helpers {
    static getTopics(repos) {
        const topics = [];
        const topicsXrepo = [];
        for (let repo of repos) {
            const topicsRepo = repo.repositoryTopics;
            if (topicsRepo !== undefined && topicsRepo !== null) {
                const topicsNode = topicsRepo.nodes;
                for (let topic of topicsNode) {
                    const obj = topic.topic;
                    if (topics.some((it) => it === obj.id) === false) {
                        topics.push(obj);
                    }
                    const topicXrepo = this.getTopicXRepo(obj, repo);
                    const existsTopicXRepo = topicsXrepo.some((t) => t.idRepo === topicXrepo.idRepo && t.idTopic === topicXrepo.idTopic);
                    if (existsTopicXRepo === false) {
                        topicsXrepo.push(topicXrepo);
                    }
                }
            }
            delete repo.repositoryTopics;
        }
        return { topics, topicsXrepo };
    }
    static getTopicXRepo(topic, repo) {
        return { idRepo: repo.id, idTopic: topic.id };
    }
    static getLicenses(data) {
        const licenses = [];
        data.repositories.forEach((repo) => {
            repo.licenseId = null;
            const licenseInfo = repo.licenseInfo;
            if (licenseInfo !== undefined && licenseInfo !== null) {
                repo.licenseId = licenseInfo.id;
                if (licenses.some((l) => l.id === licenseInfo.id) === false)
                    licenses.push(licenseInfo);
            }
            delete repo.licenseInfo;
        });
        return licenses;
    }
    static catchResultQuery(queryName, error, result, callOk = null) {
        if (error === undefined || error === null) {
            core.info(`Query "${queryName}" executed successfully`);
            if (result instanceof Array) {
                result.forEach((res) => {
                    const hasRowCount = Object.hasOwn(res, 'rowCount');
                    const hasCommand = Object.hasOwn(res, 'command');
                    if (hasRowCount && hasCommand) {
                        core.info(`Command: ${res.command}, Row Count: ${res.rowCount ?? 0}`);
                    }
                });
            }
            if (callOk !== null)
                callOk();
            return;
        }
        core.error(`Error while try execute query: ${queryName}\n${error}`);
    }
}
//# sourceMappingURL=helpers.js.map