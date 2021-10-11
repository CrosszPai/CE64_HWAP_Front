<script lang="ts">
	import { HARDWARES } from '$graphql/query/hardware.gql';

	import { operationStore, query } from '@urql/svelte';

	const hardwareQuery = operationStore(HARDWARES);
	query(hardwareQuery);
	$: hardwares = $hardwareQuery.data?.hardwares ?? [];
</script>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
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
			{:else}
				Nothings
			{/each}
		</tbody>
	</table>
</div>
