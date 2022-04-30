import { lab, queue, queue_status_enum, user, user_role_enum, working } from '@prisma/client';
import classNames from 'classnames';
import { json, LoaderFunction, redirect, useLoaderData } from 'remix';
import { auth } from '~/auth.server';
import Navbar from '~/components/shared/Navbar';
import { db } from '~/utils/db.server';

type LoaderData = {
	user: user;
	queues: (queue & {
		working:
			| (working & {
					lab: lab;
					user: {
						name: string | null;
						email: string | null;
					};
			  })
			| null;
	})[];
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
	const authData = await auth.isAuthenticated(request, {});

	if (
		authData?.user.role !== user_role_enum.instructor &&
		authData?.user.role !== user_role_enum.admin
	) {
		return redirect('/');
	}
	if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_PRIVATE_KEY) {
		return redirect('/');
	}
	const qs = await db.queue.findMany({
		orderBy: {
			updated_at: 'desc'
		},
		include: {
			working: {
				include: {
					lab: true,
					user: {
						select: {
							name: true,
							email: true
						}
					}
				}
			}
		}
	});

	return json<LoaderData>({
		user: authData.user,
		queues: qs
	});
};
const format = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' });
export default function result() {
	const data = useLoaderData<LoaderData>();
	return (
		<Navbar>
			<div className="flex">
				<a href="/instructor/lab" className="back-button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="feather feather-arrow-left"
					>
						<line x1="19" y1="12" x2="5" y2="12"></line>
						<polyline points="12 19 5 12 12 5"></polyline>
					</svg>
				</a>
				<h1 className="text-xl">ผลการทดสอบ</h1>
			</div>
			<div className="flex flex-col">
				{data.queues.map((queue) => {
					return (
						<div
							key={queue.id}
							className="card lg:card-side justify-center bordered shadow-lg mt-5 mb-5"
						>
							<div className="card-body">
								<div className="card-title flex">
									<a href={`/student/lab/${queue.working?.lab.id}`} className="card-title">
										{queue.working?.lab.lab_name}
									</a>
									<a
										href={`/student/lab/${queue.working?.lab.id}/result`}
										className={classNames('ml-auto', {
											'text-success': queue.status === queue_status_enum.pass,
											'text-warning':
												queue.status === queue_status_enum.working ||
												queue.status === queue_status_enum.waiting,
											'text-error': queue.status === queue_status_enum.fail
										})}
									>
										{queue.status.toLocaleLowerCase()}
									</a>
								</div>
								<p>{queue.working?.lab.lab_detail}</p>
								<p className="text-sm">
									Submit By : {queue.working?.user.name} : {queue.working?.user.email} at{' '}
									{format.format(new Date(queue.created_at))}{' '}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</Navbar>
	);
}
