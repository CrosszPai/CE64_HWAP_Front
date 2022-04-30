import { user } from '@prisma/client';
import { json, LoaderFunction, redirect, useLoaderData } from 'remix';
import { GitHubProfile } from 'remix-auth-github';
import { auth, sessionStorage } from '~/auth.server';
import Navbar from '~/components/shared/Navbar';
import { Role } from '~/type';

type LoaderData = {
	error: { message: string } | null;
	profile: GitHubProfile;
	user: user;
	role?: Role;
};

export const loader: LoaderFunction = async ({ request }) => {
	const authData = await auth.isAuthenticated(request, {
		failureRedirect: '/'
	});
	if (!authData) {
		return redirect('/');
	}
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	const error = session.get(auth.sessionErrorKey) as LoaderData['error'];
	return json<LoaderData>({ user: authData?.user, error, profile: authData?.profile });
};

export default function Profile() {
	const { profile } = useLoaderData<LoaderData>();
	return (
		<Navbar>
			<div className="card lg:card-side bordered shadow-lg mt-5">
				<figure>
					<img
						src={profile?.photos[0].value}
						className="w-[200px] h-[200px]"
						alt="profile"
						width="200"
						height="200"
					/>
				</figure>
				<div className="card-body mt-3">
					<h2 className="card-title">Name : {profile?.name.familyName}</h2>
					<h2 className="card-title">ID : 61010260</h2>
					<h2 className="card-title">Email : {profile?.emails?.[0].value}</h2>
				</div>
			</div>

			<div className="card lg:card-side bordered shadow-lg mt-5 mb-5">
				<div className="card-body">
					<h2 className="card-title">Lab 1</h2>
					<p>details of Lab 1</p>
				</div>
			</div>

			<div className="card lg:card-side bordered shadow-lg mt-5 mb-5">
				<div className="card-body">
					<h2 className="card-title">Lab 2</h2>
					<p>details of Lab 2</p>
				</div>
			</div>

			<div className="card lg:card-side bordered shadow-lg mt-5 mb-5">
				<div className="card-body">
					<h2 className="card-title">Lab 3</h2>
					<p>details of Lab 3</p>
				</div>
			</div>
		</Navbar>
	);
}
