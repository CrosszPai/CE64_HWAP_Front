<script lang="ts">
	import { LAB } from '$graphql/query/labs.gql';
	import { query, operationStore } from '@urql/svelte';
	import { page } from '$app/stores';
	const lab = operationStore(LAB, {
		id: parseFloat($page.params.id)
	});
	query(lab);
</script>

{#if $lab.fetching}
	loading
{:else if $lab.data?.lab}
	<div class="card lg:card-side bordered shadow-lg">
		<div class="card-body">
			<h2 class="card-title text-4xl mt-5">{lab.data.lab.lab_name}</h2>
			<p class="ml-10 mt-5">{lab.data.lab.lab_detail}</p>
		</div>
	</div>
{/if}
