<script lang="ts">
	import { LABS } from '$graphql/query/labs.gql';
	import { operationStore, query } from '@urql/svelte';

	const labs = operationStore(LABS);
	query(labs);
</script>

{#if $labs.fetching}
	<p>Loading...</p>
{:else if $labs.data.publishedLab}
	<div class="prose prose-xl">
		<h4>แล็บที่เปิดให้ทำ</h4>
	</div>
	{#each $labs.data.publishedLab as lab (lab.id)}
		<div class="card lg:card-side bordered shadow-lg mt-5 mb-5">
			<div class="card-body">
				<a sveltekit:prefetch href={`/student/labs/${lab.id}`} class="card-title">{lab.lab_name}</a>
				<p class="whitespace-pre-line">
					{lab.lab_detail
						.split('\n')
						.filter((_, index) => {
							return index < 3;
						})
						.join('\n')}
				</p>
			</div>
		</div>
	{/each}
{/if}
