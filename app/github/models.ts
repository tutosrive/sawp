export interface Owner {
    id: string;
    url: string;
    login: string;
    avatarUrl: string | null;
}

export interface Admin {
    id: string;
    bio: string | null;
    avatarUrl: string | null;
    company: string | null;
    createdAt: string;
    email: string | null;
    location: string | null;
    login: string;
    name: string | null;
    url: string;
    websiteUrl: string | null;
    stargazerCount: number;
}

export interface Language {
    id: string;
    color: string;
    name: string;
}

export interface Repository {
    id: string;
    createdAt: string | null;
    description: string | null;
    diskUsage: number;
    forkCount: number;
    homepageUrl: string | null;
    isArchived: boolean;
    name: string;
    pushedAt: string | null;
    sshUrl: string;
    stargazerCount: number;
    url: string;
    licenseId: string | null;
    readmeUrl: string | null;
    primaryLanguageId: string | null;
    ownerId: string;
    ownerStarredId: string;
}

export interface Topic {
    id: string;
    name: string;
    stargazerCount: number;
}

export interface TopicXRepository {
    idRepo: string;
    idTopic: string;
}

export interface License {
    id: string;
    name: string;
    url: string;
}

export interface StarredRepo {
    id: string;
    createdAt: string;
    description: string | null;
    diskUsage: number;
    forkCount: number;
    homepageUrl: string | null;
    isArchived: boolean;
    name: string;
    pushedAt: string;
    sshUrl: string;
    stargazerCount: number;
    url: string;
    readmeUrl: string;
    primaryLanguage?: Language | null;
    owner?: Owner;
    primaryLanguageId: string | null;
    ownerId: string | null;
    ownerStarredId: string | null;
    repositoryTopics: { nodes: { topic: { id: string; name: string } }[] };
    licenseInfo: { id: string; name: string; url: string } | null;
    defaultBranchRef?: { name: string };
}

export interface OktokitResponse {
    user: { id: string; bio: string | null; avatarUrl: string; company: string | null; createdAt: string; email: string | null; location: string | null; login: string; name: string | null; url: string; websiteUrl: string | null; stargazerCount?: number; starredRepositories?: { totalCount: number; nodes: Array<StarredRepo> } };
    repositories?: Array<StarredRepo>;
    licenses?: Array<License>;
    topicsXrepo?: Array<TopicXRepository>;
    reposTopics?: Array<Topic>;
}
