<script lang="ts">
	import { HARDWARES } from '$graphql/query/hardware.gql';

	import { operationStore, query } from '@urql/svelte';

	const hardwareQuery = operationStore(HARDWARES);
	query(hardwareQuery);
	$: hardwares = $hardwareQuery.data?.hardwares ?? [];
</script>

<div class="flex mb-2">
	<div class="btn btn-ghost loading" class:hidden={!$hardwareQuery.fetching}>
		<span class="hidden md:block">fetching</span>
	</div>
	<form class="ml-auto form-control w-full md:w-[300px] relative">
		<input name="search" type="text" placeholder="search" class="input w-full" />
		<button type="submit" class="absolute top-0 right-0 rounded-l-none btn btn-primary"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</button>
	</form>
</div>

<div class="max-w-[calc(100vw-1rem)] overflow-x-auto flex flex-col h-full">
	<table class="table w-full">
		<thead>
			<tr>
				<th />
				<th>ID</th>
				<th>Status</th>
				<th>Working Id</th>
			</tr>
		</thead>
		<tbody>
			{#each hardwares as { id, status, working_id } (id)}
				<tr>
					<th>{id}</th>
					<td>{status}</td>
					<td>{working_id}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="mt-auto md:mt-2 btn-group md:ml-auto md:mr-0 mx-auto">
		<button class="btn">Previous</button>
		<button class="btn">1</button>
		<button class="btn btn-active">2</button>
		<button class="btn">3</button>
		<button class="btn">4</button>
		<button class="btn">Next</button>
	</div>
</div>
