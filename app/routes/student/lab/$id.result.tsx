import Navbar from '~/components/shared/Navbar';
import rand from 'randomcolor';
import { lab, queue, queue_status_enum, user, working } from '@prisma/client';
import { json, LoaderFunction, redirect, useLoaderData } from 'remix';
import { auth, sessionStorage } from '~/auth.server';
import { db } from '~/utils/db.server';
import groupBy from 'lodash/groupBy';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	LinearScale,
	PointElement,
	Title,
	LineElement,
	Tooltip,
	Legend,
	CategoryScale
} from 'chart.js';
import classNames from 'classnames';

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, CategoryScale);

type LoaderData = {
	user: user;
	queue:
		| (queue & {
				working:
					| (working & {
							lab: lab;
					  })
					| null;
		  })
		| null;
	result: any;
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const authData = await auth.isAuthenticated(request, {});
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	if (!authData?.user) {
		return redirect('/');
	}
	if (!params.id) {
		return redirect('/');
	}
	const queue = await db.queue.findFirst({
		where: {
			working: {
				lab: { id: +params.id }
			}
		},
		include: {
			working: {
				include: {
					lab: true
				}
			}
		}
	});
	if (!queue) {
		return redirect('/');
	}
	const result = await fetch(
		`${process.env.FILE_SERVER_URL}/student/${queue.working?.labId}/${queue.id}/result/result.json`
	);
	let jsonResult;
	try {
		jsonResult = await result.json();
	} catch (error) {
		jsonResult = null;
	}
	return json<LoaderData>({ user: authData.user, queue, result: jsonResult });
};

const Result: React.FC = () => {
	const data = useLoaderData<LoaderData>();
	const groupedPin = useMemo(() => {
		return groupBy(data.result, 'pin');
	}, [data.result]);

	const chart = useMemo(() => {
		return Object.keys(groupedPin).map((pin) => {
			const pinData = groupedPin[pin];
			return (
				<div key={pin} className="my-4">
					<Line
						height={30}
						data={{
							labels: [...new Set(data.result.map((v:any) => v['relative_timestamp']))],
							datasets: [
								{
									label: 'logic pin ' + pin,
									data: pinData.map((v) => ({
										x: v['relative_timestamp'],
										y: v.capture === 'falling' ? 0 : 1
									})),
									stepped: true,
									fill: false,
									borderColor: rand()
								}
							]
						}}
						options={{
							interaction: {
								intersect: false,
								axis: 'xy'
							},
							scales: {
								y: {
									display: true,
									beginAtZero: true,
									min: 0,
									max: 1,
									ticks: {
										stepSize: 1
									},
									title: {
										display: true,
										text: 'level'
									}
								},
								x: {
									display: true,
									title: {
										display: true,
										text: 'time (s)'
									}
								}
							}
						}}
					/>
				</div>
			);
		});
	}, [groupedPin]);
	function download() {
		const a = document.createElement('a'); // Create "a" element
		const blob = new Blob([JSON.stringify(data.result)], { type: 'text/plain' }); // Create a blob (file-like object)
		const url = URL.createObjectURL(blob); // Create an object URL from blob
		a.setAttribute('href', url); // Set "a" element link
		a.setAttribute('download', 'result.json'); // Set download filename
		a.click(); // Start downloading
	}
	return (
		<Navbar>
			<a href="/student" className="back-button">
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
			<h1 className="card-title text-4xl mt-5 text-purple-600">
				{data.queue?.working?.lab.lab_name}
			</h1>
			<h2 className="text-2xl">
				Result :{' '}
				<span
					className={classNames('ml-auto text-2xl', {
						'text-success': data.queue?.status === queue_status_enum.pass,
						'text-error': data.queue?.status === queue_status_enum.fail
					})}
				>
					{data.queue?.status}
				</span>
			</h2>
			<div className="flex">
				<div>
					<p>Note:</p>
					<p>{data.queue?.notes}</p>
				</div>
				<div className="ml-auto">
					<button className='btn btn-secondary' onClick={download}>download result</button>
				</div>
			</div>
			{chart}
		</Navbar>
	);
};

export default Result;
