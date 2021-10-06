<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Client } from '@urql/core';
	import { LAB } from '$graphql/query/labs.gql';
	export const load: Load<{
		stuff: Client;
	}> = async ({ stuff, page }) => {
		console.log(page.params.id);
		return {
			props: {
				lab: await stuff
					.query(LAB, {
						id: parseFloat(page.params.id)
					})
					.toPromise()
			}
		};
	};
</script>

<script lang="ts">
	import type { lab } from 'src/global';
	export let lab;
	console.log(lab.data);
</script>

{#if lab.data}
	<!-- <div class="mb-5 mt-10">
		{lab.data.lab.id}
	</div>
	<div class="text-4xl mb-5">
		{lab.data.lab.lab_name}
	</div>
	<div class="mb-5 ml-12">
		{lab.data.lab.lab_detail}
	</div> -->
	<!-- <div class="mb-5 mt-10">
		{lab.data.lab.id}
	</div> -->
	<div class="card lg:card-side bordered shadow-lg">
		<div class="card-body">
			<h2 class="card-title text-4xl mt-5 text-purple-600">{lab.data.lab.lab_name}</h2>
			<p class="ml-10 mt-5">{lab.data.lab.lab_detail}</p>
		</div>
	</div>
{/if}
