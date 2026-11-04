import * as core from '@actions/core';

export function getEnvVars() {
    const githubUser = core.getInput('github-user');
    const githubToken = core.getInput('github-token');
    const dbConnectionUrl = core.getInput('db-connection-url');

    if (githubUser) process.env.GITHUB_USER = githubUser;
    if (githubToken) process.env.GITHUB_TOKEN = githubToken;
    if (dbConnectionUrl) process.env.DB_CONNECTION_URL = dbConnectionUrl;

    const missing = ['GITHUB_USER', 'GITHUB_TOKEN', 'DB_CONNECTION_URL']
        .filter((name) => !process.env[name]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
