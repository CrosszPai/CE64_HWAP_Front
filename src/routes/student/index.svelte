<script>
	import { session } from '$app/stores';
	import { WORKING } from '$graphql/query/working.gql';
	import { operationStore, query } from '@urql/svelte';

	const workingQuery = operationStore(WORKING);
	query(workingQuery);
	$: workings = $workingQuery.data?.getSelfWorking ?? [];
</script>

<div class="card lg:card-side bordered shadow-lg mt-5">
	<figure>
		<img
			src={$session.user.avatar_url}
			class="w-[200px] h-[200px]"
			alt="profile"
			width="200"
			height="200"
		/>
	</figure>
	<div class="card-body mt-3">
		<h2 class="card-title">Name : {$session.user.name}</h2>
		<h2 class="card-title">ID : 61010260</h2>
		<h2 class="card-title">Email : {$session.user.email}</h2>
	</div>
</div>
<div class="flex items-center mt-8">
	<h4 class="prose-xl" >Active Lab</h4>
	<a class="btn btn-outline ml-auto" href="/student/labs">Explore Lab</a>
</div>
<div class="flex flex-col">
	{#each workings as working (working.id)}
		<div class="card lg:card-side justify-center bordered shadow-lg mt-5 mb-5">
			<div class="card-body">
				<div class="card-title flex">
					<h2 class="card-title">{working.lab.lab_name}</h2>
					<p
						class="ml-auto"
						class:text-success={working.queue.status === 'DONE'}
						class:text-warning={working.queue.status === 'WORKING'}
						class:text-error={working.queue.status === 'ERROR'}
					>
						{working.queue.status.toLocaleLowerCase()}
					</p>
				</div>
				<p>{working.lab.lab_detail}</p>
			</div>
		</div>
	{/each}
</div>
