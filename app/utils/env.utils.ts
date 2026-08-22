import * as core from '@actions/core';

export function getEnvVars() {
    const required = { required: true };
    process.env.GITHUB_TOKEN = core.getInput('github-token', required);
    process.env.DB_CONNECTION_URL = core.getInput('db-connection-url', required);
    process.env.GITHUB_USER = core.getInput('github-user', required);
}
