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
	<div class="mb-5 mt-10">
		{lab.data.lab.id}
	</div>
	<div class="text-4xl mb-5">
		{lab.data.lab.lab_name}
	</div>
	<div class="mb-5 ml-12">
		{lab.data.lab.lab_detail}
	</div>
{/if}
