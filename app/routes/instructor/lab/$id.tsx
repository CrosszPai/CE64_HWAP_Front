import { assets, lab, user, user_role_enum } from '@prisma/client';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import GitHubButton from 'react-github-btn';
import { ActionFunction, json, LoaderFunction, redirect, useLoaderData, useSubmit } from 'remix';
import { auth } from '~/auth.server';
import Navbar from '~/components/shared/Navbar';
import { db } from '~/utils/db.server';
import { shortenFileName } from '~/utils/shortenFileName';

type LoaderData = {
	user: user;
	lab: lab & {
		assets: assets[];
	};
};

export const action: ActionFunction = async ({ request, context, params }) => {
	const authData = await auth.isAuthenticated(request, {});
	if (!authData) {
		return redirect('/');
	}
	if (!params.id) {
		return redirect('/instructor/lab');
	}
	const form = await request.formData();
	const body = Object.assign({});
	form.forEach(function (value, key) {
		body[key] = value;
	});
	const lab = await db.lab.update({
		where: {
			id: +params.id
		},
		data: {
            published: body.published === 'true'
        }
	});
	return json({ lab });
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
	const authData = await auth.isAuthenticated(request, {});
	if (
		authData?.user.role !== user_role_enum.instructor &&
		authData?.user.role !== user_role_enum.admin
	) {
		return redirect('/');
	}
	if (!params.id) {
		return redirect('/instructor/lab');
	}
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
	return json<LoaderData>({
		user: authData.user,
		lab
	});
};

export default function Lab() {
	const { lab } = useLoaderData<LoaderData>();
	const [published, setPublished] = useState<boolean>(lab.published);
	const submit = useSubmit();
	const ref = useRef<HTMLFormElement>();
	function onSubmit() {
		if (confirm('ต้องการลบข้อมูลนี้ใช่หรือไม่?') && ref.current) {
			submit(ref.current);
		}
	}
	return (
		<Navbar>
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
			<form method="POST">
				<div className="flex items-center justify-end">
					<label htmlFor="publish" className="cursor-pointer label">
						<span className="label-text ml-auto mr-2">{published ? 'Publish' : 'Draft'}</span>
					</label>
					<input
						onChange={(e) => setPublished(e.target.checked)}
						id="publish"
						type="checkbox"
						className="toggle toggle-accent"
						name="published"
                        value={published.toString()}
                        checked={published}
					/>
				</div>
				<div className="flex items-center justify-end">
					<button
						aria-label="submit-lab"
						className={classNames('btn btn-primary mt-5', {
							'!btn-outline': !published
						})}
						role="button"
						aria-pressed="true"
					>
						Save
					</button>
				</div>
			</form>
		</Navbar>
	);
}

function checkURL(url: string) {
	return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}
