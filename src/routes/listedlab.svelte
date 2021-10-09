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
            <!-- <li>
                {lab.id}
				{lab.lab_name}
				{lab.lab_detail}
            </li> -->
			<div class="card shadow-lg">
				<div class="card-body">
				  <h2 class="card-title">{lab.lab_name}</h2> 
				  <p>{lab.lab_detail}</p>
				</div>
			</div>
        {/each}
	</ul>
{/if}
