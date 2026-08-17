import * as core from '@actions/core'
import * as github from '@actions/github'
try {
    const tk = core.getInput("TOKEN")
    const okt = github.getOctokit(tk)
    const test = async()=>{
        const data = await okt.graphql('query{user(login: "tutosrive"){bio}}')
        console.log(data)
    }
test()
} catch (error) {
    core.error(error)
}