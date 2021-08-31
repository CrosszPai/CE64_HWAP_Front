import type { GetSession, Handle } from '@sveltejs/kit';
import { GithubAuthentication, TokenResponse } from './api/authentication';
import cookie from 'cookie';
import type { GithubUser } from './global';

export const getSession: GetSession = async (request) => {
	const cookieToken = cookie.parse(request.headers.cookie ?? '');

	let token: TokenResponse = {};
	let user: GithubUser | null = request.locals.user;

	if (cookieToken.refresh_token?.length !== 0) {
		try {
			token = await GithubAuthentication.getTokenFromRefreshToken(cookieToken.refresh_token);
			request.locals.token = token;
		} catch (error) {
			console.log(error);
		}
	}

	if (token.access_token) {
		user = await GithubAuthentication.getBasicUserProfile(token.access_token);
		request.locals.user = user;
		return { token, user };
	}

	try {
		token = await GithubAuthentication.signInByCode(request.query);
		user = await GithubAuthentication.getBasicUserProfile(token.access_token);
		request.locals.user = user;
		request.locals.token = token;
	} catch (error) {
		console.log(error);
	}
	return {
		token,
		user
	};
};

export const handle: Handle = async ({ request, resolve }) => {
	// code here happends before the endpoint or page is called

	const response = await resolve(request);

	// code here happens after the endpoint or page is called
	//@ts-ignore
	response.headers['set-cookie'] = [
		`access_token=${request.locals.token?.access_token};`,
		`refresh_token=${request.locals.token?.refresh_token};`
	];
	if (request.query.get('code')) {
		response.headers['Location'] = '/';
		response.status = 302;
		return response;
	}
	return response;
};
