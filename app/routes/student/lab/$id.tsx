import {
	assets,
	hardware_status_enum,
	lab,
	queue_status_enum,
	user,
	user_role_enum
} from '@prisma/client';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import GitHubButton from 'react-github-btn';
import {
	ActionFunction,
	json,
	LoaderFunction,
	redirect,
	useActionData,
	useLoaderData,
	useSubmit
} from 'remix';
import { auth } from '~/auth.server';
import Navbar from '~/components/shared/Navbar';
import { db } from '~/utils/db.server';
import { getRepos } from '~/utils/getRepos';
import { shortenFileName } from '~/utils/shortenFileName';

type ActionData = { message: string } | undefined;

type LoaderData = {
	user: user;
	lab: lab & {
		assets: assets[];
	};
	repos: Awaited<ReturnType<typeof getRepos>>;
	disabled: boolean;
};

export const action: ActionFunction = async ({ request, context, params }) => {
	const authData = await auth.isAuthenticated(request, {});
	if (!authData) {
		return redirect('/');
	}
	if (!params.id) {
		return redirect('/student/lab');
	}
	const form = await request.formData();
	const body = Object.assign({});
	form.forEach(function (value, key) {
		body[key] = value;
	});
	const lab = await db.lab.findFirst({
		where: {
			id: +params.id
		}
	});
	if (!lab) {
		return json<ActionData>({ message: 'ไม่พบข้อมูลที่ต้องการ' });
	}
	const working = await db.working.create({
		data: {
			repo_url: body.repo_url,
			labId: +lab.id,
			ownerId: authData.user.id,
			queue: {
				create: {
					status: queue_status_enum.waiting
				}
			}
		},
		include: {
			queue: true
		}
	});
	return redirect('/student');
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
	const authData = await auth.isAuthenticated(request, {});
	if (!authData) {
		return redirect('/');
	}
	if (!params.id) {
		return redirect('/instructor/lab');
	}
	let disabled = false;
	const lab = await db.lab.findFirst({
		where: {
			id: +params.id
		},
		include: {
			assets: true
		}
	});
	if (!lab) {
		return redirect('/instructor/lab');
	}
	const working = await db.working.findFirst({
		where: {
			labId: +lab.id,
			ownerId: authData.user.id
		}
	});
	if (working) {
		disabled = true;
	}

	const repos = await getRepos(authData.profile);
	return json<LoaderData>({
		user: authData.user,
		lab,
		repos,
		disabled
	});
};

export default function Lab() {
	const { lab, repos, disabled } = useLoaderData<LoaderData>();
	const [repo, setRepo] = useState<string>('-1');
	const action = useActionData<ActionData>();
	return (
		<Navbar>
			<a href="/student/lab" className="back-button">
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
			<div className="card lg:card-side bordered shadow-lg">
				<div className="card-body">
					<h2 className="card-title text-4xl mt-5 text-purple-600">{lab.lab_name}</h2>
					<p className="mt-5 whitespace-pre-line">{lab.lab_detail}</p>
					<div className="ml-auto">
						<GitHubButton data-icon="octicon-repo-fork" data-size="large" href={lab.repo_url}>
							fork
						</GitHubButton>
					</div>
				</div>
			</div>
			<div className="card shadow-lg mt-5 mb-5">
				<div className="card-body">
					<div className="card-title">assets</div>
					<div className="grid gap-4 grid-cols-[repeat(auto-fill,8rem)]">
						{lab.assets.map((asset) => (
							<a
								key={asset.url}
								target="__blank"
								href={asset.url}
								className="grid w-32 h-32 border place-items-center"
							>
								<img
									className="w-12 h-12"
									src={checkURL(asset.url) ? asset.url : '/svg/document.svg'}
									alt={`file-${asset.url}`}
								/>
								<span className="text-sm">
									{shortenFileName(asset.url.split('/').pop() as string)}
								</span>
							</a>
						))}
					</div>
				</div>
			</div>
			<div className="mt-8 text-right">
				<a
					className="underline text-red-500"
					href="https://github.com/apps/HWAP-CE/installations/new"
					target="_blank"
				>
					หากไม่พบ repo ใน github
				</a>
			</div>
			<form method="POST" className="flex justify-end mt-10 mb-5">
				<select
					className="select select-bordered w-full max-w-xs"
					onChange={(e) => {
						setRepo(e.currentTarget.value);
					}}
					name="repo_url"
					disabled={!!disabled}
				>
					<option disabled selected value="-1">
						เลือก repo ที่ต้องการ link
					</option>
					{repos.map((repo) => (
						<option key={repo.id} value={repo.html_url}>
							{repo.name}
						</option>
					))}
				</select>
				<button type="submit" disabled={repo === '-1' || disabled} className="btn ml-2 btn-primary">
					{disabled ? "เชื่อมแล็ปแล้ว" : "Link with lab."}
				</button>
			</form>
			{action?.message && <div className="flex justify-end mt-10 mb-5">{action.message}</div>}
		</Navbar>
	);
}

function checkURL(url: string) {
	return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}
