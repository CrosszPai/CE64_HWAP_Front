<script lang="ts">
	import { SELF_LABS } from '$graphql/query/labs.gql';
	import { query, operationStore } from '@urql/svelte';
	const labs = operationStore(SELF_LABS);
	query(labs);
</script>

<div class="text-right">
	<!-- a tag href = '/instructor/create' -->
	<a class="btn btn-primary" href="/instructor/create">
		สร้างแล็ปใหม่
	</a>
</div>
{#if $labs.fetching}
	...loading
{:else}
	<ul>
		{#each labs.data.selfLabs as lab, i}
			<div class="card shadow-lg mt-5 mb-5">
				<div class="card-body">
					<h2 class="card-title">Lab {lab.id} : {lab.lab_name}</h2>
					<h4 class="font-bold">Detail</h4>
					<div>{lab.lab_detail}</div>
					<p class="font-bold">
						Template Repository: <a class="link font-normal" href={lab.repo_url}>{lab.repo_url}</a>
					</p>
					<div class="card shadow-lg mt-5 mb-5">
						<div class="card-body">
							<div class="card-title">assets</div>
							<div class="grid gap-4 grid-cols-[repeat(auto-fill,8rem)]">
								{#each lab.assets as asset, i}
									<img class="h-32 w-32" src={asset.url} alt={`assets-${i}`} />
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</ul>
{/if}
