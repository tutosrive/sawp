import * as core from '@actions/core'

export function getEnvVars(){
    const required = {required: true}
    process.env.GITHUB_TOKEN = core.getInput('GITHUB_TOKEN', required)
    process.env.DB_CONNECTION_URL = core.getInput('DB_CONNECTION_URL', required)
    process.env.GITHUB_USER = core.getInput('GITHUB_USER', required)
}