<script lang="ts">
	import { SELF_LABS } from '$graphql/query/labs.gql';
	import { query, operationStore } from '@urql/svelte';
	import { page } from '$app/stores';
	const labs = operationStore(SELF_LABS);
	query(labs);
</script>

{#if $labs.fetching}
	...loading
{:else}
	<ul>
		{#each labs.data.selfLabs as lab, i}
            <li>
                {lab.id}
				{lab.lab_name}
				{lab.lab_detail}
            </li>
        {/each}
	</ul>
{/if}
