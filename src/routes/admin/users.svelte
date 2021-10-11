<script lang="ts">
	import { USERS } from '$graphql/query/user.gql';

	import { operationStore, query } from '@urql/svelte';

	const userQuery = operationStore(USERS);
	query(userQuery);
	$: users = $userQuery.data?.users ?? [];
</script>


<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Email</th>
			</tr>
		</thead>
		<tbody>
			{#each users as { id, name, email } (id)}
				<tr>
					<th>{id}</th>
					<td>{name}</td>
					<td>{email}</td>
				</tr>
			{:else}
				Nothings
			{/each}
		</tbody>
	</table>
</div>
