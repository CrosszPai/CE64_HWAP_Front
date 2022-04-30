import { hardware, lab, queue, user, user_role_enum, working } from '@prisma/client';
import { ActionFunction, Form, json, LoaderFunction, redirect, useLoaderData } from 'remix';
import { auth, sessionStorage } from '~/auth.server';
import AdminNavbar from '~/components/Admin/AdminNavbar';
import CreateHardwareModal from '~/components/Admin/CreateHardwareModal';
import { HardwareStatus } from '~/type';
import { db } from '~/utils/db.server';

type LoaderData = {
	user: user;
	error: { message: string } | null;
	workings: (working & {
		lab: lab;
		user: user;
		queue: queue[];
	})[];
};

type ActionData = {
	formError?: string;
	fieldErrors?: {
		name: string | undefined;
		content: string | undefined;
	};
	fields?: {
		name: string;
		content: string;
	};
};


export const loader: LoaderFunction = async ({ request, context, params }) => {
	const authData = await auth.isAuthenticated(request, {});
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	const error = session.get(auth.sessionErrorKey) as LoaderData['error'];
	if (authData?.user.role !== user_role_enum.admin) {
		return redirect('/');
	}

	const workings = await db.working.findMany({
		include: {
			lab: true,
			user: true,
			queue: true
		}
	});

	return json<LoaderData>({
		user: authData.user,
		error,
		workings: workings
	});
};

const Working: React.FC = () => {
	const data = useLoaderData<LoaderData>();
	return (
		<AdminNavbar>
			<div className="flex flex-col">
				<div className="flex mb-2">
					<div className="ml-auto form-control w-full md:w-[300px] relative">
						<input name="search" type="text" placeholder="search" className="input w-full" />
						<button
							type="submit"
							aria-label="search"
							className="absolute top-0 right-0 rounded-l-none btn btn-primary"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div className="max-w-[calc(100vw-1rem)] overflow-x-auto flex flex-col h-full ">
					<table className="table w-full">
						<thead>
							<tr>
								<th>ID</th>
								<th>Lab</th>
								<th>User</th>
								<th>Status</th>
								<th>Repo</th>
								<th>Noted</th>
								<th className="flex">
									<button className="btn ml-auto">Trigger Check</button>
								</th>
							</tr>
						</thead>
						<tbody>
							{data.workings.map((working) => {
								return (
									<tr key={working.id}>
										<th>{working.id}</th>
										<td>{working.lab.lab_name}</td>
										<td>{working.user.name}</td>
										<td>{working.queue[working.queue.length - 1].status}</td>
										<td >
											<a target="_blank" href={working.repo_url} >{working.repo_url}</a>
										</td>
										<td>
											{working.queue[working.queue.length - 1].notes}
										</td>
										<td></td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</AdminNavbar>
	);
};
export default Working;
