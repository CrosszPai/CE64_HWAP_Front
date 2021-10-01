<script>
	import { goto } from '$app/navigation';

	import { REPOS } from '$graphql/query/github.gql';
	import { operationStore, query } from '@urql/svelte';

	const repos = operationStore(REPOS);
	query(repos);
</script>

<select
	class="select select-bordered w-full max-w-xs"
	on:change|preventDefault={(e) => {
		if (e.currentTarget.value === 'link') goto('https://github.com/apps/HWAP-CE/installations/new');
	}}
>
	{#if $repos.fetching}
		<option disabled selected>Choose your repo</option>
		<option disabled>fetching</option>
	{:else if $repos.error}
		<option disabled selected>Choose your repo {$repos.error}</option>
		<option value="link"> Install App to use github repository </option>
	{:else if $repos.data.repos}
		<option disabled selected>Choose your repo</option>
		{#each $repos.data.repos as repo (repo.id)}
			<option>{repo.name}</option>
		{/each}
	{/if}
</select>
