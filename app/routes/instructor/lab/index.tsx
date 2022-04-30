import { assets, lab, user, user_role_enum } from '@prisma/client';
import { json, LoaderFunction, redirect, useLoaderData } from 'remix';
import { auth, sessionStorage } from '~/auth.server';
import Navbar from '~/components/shared/Navbar';
import { db } from '~/utils/db.server';

type LoaderData = {
	error: { message: string } | null;
	labs: Array<lab & { assets: assets[] }>;
	user: user;
};

// find lab from owner
export const loader: LoaderFunction = async ({ request, context, params }) => {
	const authData = await auth.isAuthenticated(request, {});
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	if (
		authData?.user.role !== user_role_enum.instructor &&
		authData?.user.role !== user_role_enum.admin
	) {
		return redirect('/');
	}
	const labs = await db.lab.findMany({
		include: {
			assets: true
		}
	});
	const error = session.get(auth.sessionErrorKey) as LoaderData['error'];
	return json<LoaderData>({
		error,
		labs: labs,
		user: authData.user
	});
};

export default function Labs() {
	const { labs } = useLoaderData<LoaderData>();
	return (
		<Navbar>
			<div className="flex items-center">
				<div>
					<a className="btn btn-outline" href="/instructor/result">
						ดูผลการทดสอบ
					</a>
				</div>
				<div className="ml-auto">
					<a className="btn btn-primary" href="/instructor/create">
						สร้างแล็ปใหม่
					</a>
				</div>
			</div>
			<ul>
				{labs.map((lab) => (
					<li key={lab.id} className="card shadow-lg mt-5 mb-5">
						<div className="card-body">
							<a href={`/instructor/lab/${lab.id}`} className="underline card-title">
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
			</ul>
		</Navbar>
	);
}
