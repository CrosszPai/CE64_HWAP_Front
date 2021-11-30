<script lang="ts">
	import { goto } from '$app/navigation';
	import { ADD_WORKING } from '$graphql/mutation/working.gql';

	import { REPOS } from '$graphql/query/github.gql';
	import { LABS } from '$graphql/query/labs.gql';
	import { mutation, operationStore, query } from '@urql/svelte';

	let lab: string = '';
	let repo: string = '';

	const repos = operationStore(REPOS);
	query(repos);

	const labs = operationStore(LABS);
	query(labs);

	const addWorkingStore = operationStore(ADD_WORKING);
	const addWorking = mutation(addWorkingStore);
	function addWorkingHandler() {
		addWorking({
			lab,
			repo
		});
	}
</script>

<select
	class="select select-bordered w-full max-w-xs"
	on:change|preventDefault={(e) => {
		if (e.currentTarget.value === 'link') {
			goto('https://github.com/apps/HWAP-CE/installations/new');
		} else {
			repo = e.currentTarget.value;
		}
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
			<option value={repo.url}>{repo.name}</option>
		{/each}
	{/if}
</select>

<select
	on:change|preventDefault={(e) => (lab = e.currentTarget.value)}
	class="select select-bordered w-full max-w-xs"
>
	{#if $labs.fetching}
		<option disabled selected>Choose your repo</option>
		<option disabled>fetching</option>
	{:else if $labs.data.publishedLab}
		<option disabled selected>Choose your repo</option>
		{#each $labs.data.publishedLab as lab (lab.id)}
			<option value={lab.id}>{lab.lab_name}</option>
		{/each}
	{/if}
</select>

<button on:click={addWorkingHandler} class="btn btn-primary">Add</button>
