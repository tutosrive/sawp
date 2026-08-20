const license:string = `licenseInfo{
    id
    name
    url
}`

const topic:string = `repositoryTopics(first:100){
    nodes{
        topic{
            id
            name
        }
    }
}`

const primaryLanguage:string = `primaryLanguage{
    id
    color
    name
}`

const owner:string = `owner{
    id
    url
    login
    avatarUrl
}`

const starredRepos:string = `starredRepositories(first: $first){
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
    }
}`

const query:string = `
    query getStarredRepos($username: String!, $first: Int! = 5){
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
            ${starredRepos}
        }
    }
`

export default query