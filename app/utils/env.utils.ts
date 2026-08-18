import * as core from '@actions/core'

export function getEnvVars(){
    process.env.GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    process.env.SUPABASE_TOKEN = core.getInput('SUPABASE_TOKEN')
    process.env.SUPABASE_URL = core.getInput('SUPABASE_URL')
    process.env.DB_CONNECTION_URL = core.getInput('DB_CONNECTION_URL')
    process.env.GITHUB_USER = core.getInput('GITHUB_USER')
}