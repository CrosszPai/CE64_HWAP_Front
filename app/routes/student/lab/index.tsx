import { lab, user } from '@prisma/client';
import { json, Link, LoaderFunction, redirect, useLoaderData } from 'remix';
import { auth, sessionStorage } from '~/auth.server';
import Navbar from '~/components/shared/Navbar';
import { db } from '~/utils/db.server';

type LoaderData = {
	error: { message: string } | null;
	user: user;
	labs: lab[];
};

export const loader: LoaderFunction = async ({ request }) => {
	const authData = await auth.isAuthenticated(request, {});
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	const error = session.get(auth.sessionErrorKey) as LoaderData['error'];
	if (!authData?.user || error) {
		return redirect('/');
	}
	const publishedLabs = await db.lab.findMany({
		where: {
			published: true
		}
	});

	return json<LoaderData>({ error, user: authData.user, labs: publishedLabs });
};

const Labs: React.FC = () => {
	const { labs } = useLoaderData<LoaderData>();

	return (
		<Navbar>
			<div className="prose prose-xl">
				<h4>แล็บที่เปิดให้ทำ</h4>
			</div>
			<div className="flex flex-col">
				{labs.map((lab) => (
					<li key={lab.id} className="card shadow-lg mt-5 mb-5">
						<div className="card-body">
							<a href={`/student/lab/${lab.id}`} className="underline card-title">
							  {lab.lab_name}
							</a>
							<h4 className="font-bold">Detail</h4>
							<div>{lab.lab_detail}</div>
							<p className="font-bold">
								Template Repository:{' '}
								<a className="link font-normal" href={lab.repo_url}>
									{lab.repo_url}
								</a>
							</p>
						</div>
					</li>
				))}
			</div>
		</Navbar>
	);
};

export default Labs;
