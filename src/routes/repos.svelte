<script context="module" lang="ts">
	import { REPOS } from '$graphql/query/github';

	import type { Load } from '@sveltejs/kit';
	import type { Client } from '@urql/core';
	export const load: Load<{
		context: Client;
	}> = async ({ context }) => {

		return {
			props: {
				result: await context.query(REPOS)
			}
		};
	};
</script>

<script>
	export let result;
	console.log(result);
</script>
