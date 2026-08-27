const pageInfo: string = `pageInfo{
    hasNextPage
    endCursor
}`;

const license: string = `licenseInfo{
    id
    name
    url
}`;

const topic: string = `repositoryTopics(first:100){
    nodes{
        topic{
            id
            name
        }
    }
}`;

const primaryLanguage: string = `primaryLanguage{
    id
    color
    name
}`;

const owner: string = `owner{
    id
    url
    login
    avatarUrl
}`;

const defaultBranch: string = `defaultBranchRef {
      name
}`;

const starredRepos: string = `starredRepositories(first: $first, after: $endCursor){
    totalCount
    nodes{
        id
        createdAt
        description
        diskUsage
        forkCount
        homepageUrl
        isArchived
        name
        pushedAt
        sshUrl
        stargazerCount
        url
        ${primaryLanguage}
        ${owner}
        ${topic}
        ${license}
        ${defaultBranch}
    }
    ${pageInfo}
}`;

export const admin: string = `query getAdmin($username: String!){
    user(login: $username){
        id
        bio
        avatarUrl
        company
        createdAt
        email
        location
        login
        name
        url
        websiteUrl
    }
}`;

export const query: string = `
    query getStarredRepos($username: String!, $first: Int! = 5, $endCursor: String){
        user(login: $username){
            ${starredRepos}
        }
    }
`;
