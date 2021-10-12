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
			<div class="card shadow-lg mt-5 mb-5">
				<div class="card-body">
				  <h2 class="card-title">Lab {lab.id} : {lab.lab_name}</h2> 
				  <div>{lab.lab_detail}</div>
				</div>
			</div>
        {/each}
	</ul>
{/if}
