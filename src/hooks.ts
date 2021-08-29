import type { GetSession, Handle } from '@sveltejs/kit';
import { GithubAuthentication, TokenResponse } from './api/authentication';
import cookie from 'cookie';

export const getSession: GetSession = async (request) => {
	const cookieToken = cookie.parse(request.headers.cookie ?? '');

	let token: TokenResponse = {};

	if (cookieToken.refresh_token?.length !== 0) {
		try {
			token = await GithubAuthentication.getTokenFromRefreshToken(cookieToken.refresh_token);
			request.locals.token = token;
		} catch (error) {
			console.log(error);
		}
	}

	if (token.access_token) {
		return { token };
	}

	try {
		token = await GithubAuthentication.signInByCode(request.query);
		request.locals.token = token;
	} catch (error) {
		console.log(error);
	}
	return {
		token
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
