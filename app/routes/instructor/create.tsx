import { user, user_role_enum } from '@prisma/client';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import {
	ActionFunction,
	json,
	LoaderFunction,
	redirect,
	unstable_createFileUploadHandler,
	unstable_parseMultipartFormData,
	useLoaderData
} from 'remix';
import { auth } from '~/auth.server';
import Navbar from '~/components/shared/Navbar';
import { getRepos } from '~/utils/getRepos';
import { db } from '~/utils/db.server';
import { shortenFileName } from '~/utils/shortenFileName';
import childe from 'child_process';

export const action: ActionFunction = async ({ request, context, params }) => {
	const authData = await auth.isAuthenticated(request, {});
	if (!authData) {
		return redirect('/');
	}
	console.log(__dirname);
	const uploadHandler = unstable_createFileUploadHandler({
		maxFileSize: 10_000_000,
		directory: __dirname + '/uploads/',
		file: ({ filename }) => filename
	});
	const form = await unstable_parseMultipartFormData(request, uploadHandler);
	const lab_name = form.get('lab_name')?.toString();
	const lab_detail = form.get('lab_detail')?.toString();
	const repo_url = form.get('repo_url')?.toString();
	const published = form.get('published');
	const assets = form.getAll('assets') as File[];
	const test_script = form.get('test_script') as File;

	// console.log(assets);
	console.log(lab_name, lab_detail, repo_url, published);

	// validate data and cast to string
	if (!lab_name || !lab_detail || !repo_url) {
		console.error('pog');
		return redirect('/instructor/create');
	}
	const user = authData.user;
	const lab = await db.lab.create({
		data: {
			ownerId: user.id,
			lab_name,
			lab_detail,
			repo_url,
			published: published === 'true'
		}
	});
	const headers = new Headers();
	const credentials = Buffer.from('user:password', 'utf-8').toString('base64');
	console.log(credentials);
	headers.append('Authorization', `Basic ${credentials}`);
	await Promise.all(
		assets.map((asset) => {
			const formfile = new FormData();
			formfile.append('file', asset);
			return fetch(`${process.env.FILE_SERVER_URL}/instructor/${user.id}/lab/${lab.id}/assets/`, {
				method: 'POST',
				body: formfile,
				headers: headers
			});
		})
	);
	const formfile = new FormData();
	formfile.append('file', test_script);
	const test_script_url = await fetch(
		`${process.env.FILE_SERVER_URL}/instructor/${user.id}/lab/${lab.id}/test_script/test_script.json`,
		{
			method: 'POST',
			body: formfile,
			headers: headers
		}
	);
	await db.lab.update({
		where: {
			id: lab.id
		},
		data: {
			test_script_url: test_script_url.url
		}
	});

	childe.exec(`rm -rf ${__dirname}/uploads`);
	await db.assets.createMany({
		data: assets.map((asset) => {
			return {
				labId: lab.id,
				url: `/instructor/${user.id}/lab/${lab.id}/assets/${asset.name}`
			};
		})
	});
	return redirect(`/instructor/lab/${lab.id}`);
};
type LoaderData = {
	user: user;
	repos: Awaited<ReturnType<typeof getRepos>>;
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
	try {
		const repo = await getRepos(authData.profile);

		return json<LoaderData>({
			user: authData.user,
			repos: repo
		});
	} catch (error) {
		return redirect('https://github.com/apps/HWAP-CE/installations/new');
	}
};

export default function Create() {
	const { repos } = useLoaderData<LoaderData>();
	const [assets, setAssets] = useState<File[]>([]);
	const [published, setPublished] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const testInputRef = useRef<HTMLInputElement>(null);
	const [tick, setTick] = useState(0);

	function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (files) {
			setAssets(Array.from(files));
		}
	}
	function removeFile(index: number) {
		const files = fileInputRef.current?.files;
		if (!files) return;
		const dt = new DataTransfer();

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (index !== i) dt.items.add(file); // here you exclude the file. thus removing it.
		}

		fileInputRef.current.files = dt.files; // Assign the updates list
		setAssets(Array.from(fileInputRef.current.files));
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
			<div className="text-center w-full">
				<div className="p-10 card bg-base-200 h-1/2">
					<form encType="multipart/form-data" method="POST" className="form-control mb-5 mt-5">
						<label className="label" htmlFor="name">
							<span className="label-text">Lab Name</span>
						</label>
						<input
							id="name"
							className="input input-bordered textarea h-2/4"
							placeholder="lab name"
							name="lab_name"
						/>
						<label className="label" htmlFor="detail">
							<span className="label-text">Lab detail</span>
						</label>
						<textarea
							id="detail"
							name="lab_detail"
							className="textarea h-2/4"
							placeholder="details"
						/>
						<div className="mt-5">
							<div
								className={classNames(
									'border-dashed p-4 border-2 w-full min-h-[128px] rounded grid gap-4 grid-cols-[repeat(auto-fill,8rem)]',
									{
										'!flex': assets.length === 0,
										'justify-center': assets.length === 0,
										'items-center': assets.length === 0
									}
								)}
							>
								{assets.length ? (
									<>
										{assets.map((file, index) => {
											return (
												<div className="indicator">
													<div
														onClick={() => {
															removeFile(index);
														}}
														className="cursor-pointer indicator-item badge badge-error"
													>
														x
													</div>

													{file.type.split('/')[0] === 'image' ? (
														<div className="grid w-32 h-32 bg-base-300 place-items-center">
															<img src={URL.createObjectURL(file)} alt={`file-${index}`} />
															<span className="text-sm">{shortenFileName(file.name)}</span>
														</div>
													) : (
														<div className="grid w-32 h-32 border place-items-center">
															<img
																className="w-12 h-12"
																src={'/svg/document.svg'}
																alt={`file-${index}`}
															/>
															<span className="text-sm">{shortenFileName(file.name)}</span>
														</div>
													)}
												</div>
											);
										})}{' '}
										<div className="grid w-32 h-32  place-items-center border border-dashed">
											<img src="/svg/upload.svg" alt="upload" className="h-8" />
										</div>
									</>
								) : (
									<>
										<img src="/svg/upload.svg" alt="upload" className="h-8 mr-2" />
										<p className="block text-grey">
											Click or Drop your assets
											<span
												onClick={() => fileInputRef.current?.click()}
												className="text-info cursor-pointer underline"
											>
												here
											</span>
										</p>
									</>
								)}
								<input
									onChange={onFileChange}
									ref={fileInputRef}
									accept="image/* .pdf .docx .doc"
									type="file"
									className="hidden"
									multiple
									name="assets"
								/>
							</div>
						</div>
						<label className="mt-4 w-full text-left">
							<p className="inline mr-2">Select Template Repository</p>
							<select name="repo_url" className="select select-bordered w-full max-w-xs mt-4">
								<option disabled selected>
									Choose your repo
								</option>
								{repos.map((repo) => {
									return (
										<option key={repo.id} value={repo.html_url}>
											{repo.name}
										</option>
									);
								})}
							</select>
						</label>
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
							/>
						</div>
						<div className="text-left">
							<label htmlFor="test_script">Select a test script:</label>
							<input
								ref={testInputRef}
								onChange={(e) => {
									setTick((d) => d + 1);
								}}
								type="file"
								id="test_script"
								name="test_script"
							/>
						</div>
						{tick > 0 && testInputRef.current?.files && (
							<div>
								<div className="grid w-32 h-32 border place-items-center">
									<img className="w-12 h-12" src={'/svg/document.svg'} alt={`test_script`} />
									<span className="text-sm">{testInputRef.current?.files?.[0].name}</span>
								</div>
							</div>
						)}
						<button
							aria-label="submit-lab"
							className={classNames('btn btn-primary self-end mt-5', {
								'!btn-outline': !published
							})}
							role="button"
							aria-pressed="true"
						>
							{published ? 'Publish' : 'Save'}
						</button>
					</form>
				</div>
			</div>
		</Navbar>
	);
}
