import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$lib/Env';
import type { GithubUser } from 'src/global';

export type TokenResponse = {
	access_token?: string;
	expires_in?: number;
	refresh_token?: string;
	refresh_token_expires_in?: number;
	scope?: string;
	token_type?: string;
};

export const GithubAuthentication = {
	async signInByCode(query: URLSearchParams): Promise<TokenResponse | Object> {
		const code = query.get('code');
		if (!code) {
			return {};
		}
		const response = await fetch(
			`https://github.com/login/oauth/access_token?code=${code}&client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json'
				}
			}
		);
		return await response.json();
	},
	async getTokenFromRefreshToken(refresh_token: string): Promise<TokenResponse> {
		const response = await fetch(
			`https://github.com/login/oauth/access_token?refresh_token=${refresh_token}&grant_type=refresh_token&client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json'
				}
			}
		);
		return await response.json();
	},
	async getBasicUserProfile(access_token: string): Promise<GithubUser> {
		const response = await fetch('https://api.github.com/user', {
			headers: {
				Accept: 'application/json',
				Authorization: `token ${access_token}`
			}
		});
		return await response.json();
	}
};
