import { App } from "octokit";
import { LoaderFunction, redirect } from "remix";
import { GitHubProfile } from "remix-auth-github";
import { auth } from "~/auth.server";

export async function getRepos(profile: GitHubProfile) {
    if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_PRIVATE_KEY || !profile) {
        return []
    }
    const app = new App({
        appId: process.env.GITHUB_APP_ID,
        privateKey: process.env.GITHUB_PRIVATE_KEY,
    })
    const installation = await app.octokit.request('GET /users/{username}/installation', {
        username: profile._json.login,
    })
    let appi = await app.getInstallationOctokit(installation.data.id);
    const repo = await appi.request('GET /installation/repositories', {
        per_page: 50,
    })
    return repo.data.repositories
}