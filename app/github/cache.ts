import { access, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { type OktokitResponse } from './models.js';

const CACHE_FILE = '.sawp-github-cache.json';

function cachePath(): string {
    const workspace = process.env.GITHUB_WORKSPACE ?? process.cwd();
    return path.join(workspace, CACHE_FILE);
}

export async function readGithubCache(): Promise<OktokitResponse | null> {
    try {
        await access(cachePath());
        return JSON.parse(await readFile(cachePath(), 'utf8')) as OktokitResponse;
    } catch (error: any) {
        if (error?.code === 'ENOENT') return null;
        await clearGithubCache();
        return null;
    }
}

export async function writeGithubCache(data: OktokitResponse): Promise<void> {
    const target = cachePath();
    const temporary = `${target}.tmp`;
    await writeFile(temporary, JSON.stringify(data), 'utf8');
    await rename(temporary, target);
}

export async function clearGithubCache(): Promise<void> {
    await rm(cachePath(), { force: true });
}
