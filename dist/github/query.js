const pageInfo = `pageInfo{
    hasNextPage
    endCursor
}`;
const license = `licenseInfo{
    id
    name
    url
}`;
const topic = `repositoryTopics(first:100){
    nodes{
        topic{
            id
            name
        }
    }
}`;
const primaryLanguage = `primaryLanguage{
    id
    color
    name
}`;
const owner = `owner{
    id
    url
    login
    avatarUrl
}`;
const defaultBranch = `defaultBranchRef {
      name
}`;
const starredRepos = `starredRepositories(first: $first, after: $endCursor){
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
export const admin = `query getAdmin($username: String!){
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
export const query = `
    query getStarredRepos($username: String!, $first: Int! = 5, $endCursor: String){
        user(login: $username){
            ${starredRepos}
        }
    }
`;
//# sourceMappingURL=query.js.map