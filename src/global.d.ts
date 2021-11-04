/// <reference types="@sveltejs/kit" />
export declare interface GithubUser {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	name: string;
	company?: unknown;
	blog: string;
	location?: unknown;
	email?: unknown;
	hireable?: unknown;
	bio?: unknown;
	twitter_username?: unknown;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: Date;
	updated_at: Date;
}

export declare interface lab {
	id: number;
	lab_name: string;
	lab_detail?: string;
	assets: { url: string }[];
	repo_url: string;
}

export declare class Repo {
	readonly id?: number;
	readonly name?: string;
	readonly url?: string;
	readonly html_url?: string;
}

export declare enum Role {
	instructor = 'instructor',
	student = 'student',
	admin = 'admin'
}
export declare class User {
	id?: number;
	email?: string;
	name?: string;
	entered_at?: Date;
	role?: Role;
	labs?: Lab[];
	avatar_url?: string;
}

export declare class Hardware {
	id?: string;
	createdAt?: string;
	status?: string;
	working_id?: string;
}
