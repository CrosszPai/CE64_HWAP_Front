<script context="module" lang="ts">
	import { get, readable } from 'svelte/store';
	import { Client, operationStore } from '@urql/svelte';
	import { browser, dev } from '$app/env';
	import { createClient } from '$lib/graphql';
	import type { Load } from '@sveltejs/kit';
	import { GRAPHQL_ENDPOINT } from '$lib/Env';

	export const load: Load = async ({ fetch, stuff, session }) => {
		const client = await createClient({
			// Pass in the fetch from sveltekit to have access to serialized requests during hydration
			url: GRAPHQL_ENDPOINT,
			fetch,
			dev: browser && dev,
			fetchOptions: {
				headers: {
					'set-cookie': `access_token=${session.token.access_token}`
				}
			}
		});
		return {
			stuff: {
				...stuff,
				client,
				// Works just like query from @urql/svelte
				query: async (query, variables, context, normalize) => {
					const store = operationStore(query, variables, context);
					const result = await client
						.query(store.query, store.variables, store.context)
						.toPromise();
					Object.assign(get(store), result);
					// Allow to access deep nested object directly at data
					if (normalize) {
						const { subscribe } = store;
						return Object.create(store, {
							subscribe: {
								enumerable: true,
								value: readable(store, (set) => {
									const unsubscribe = subscribe((result) => {
										if (result.data) {
											Object.assign(result.data, normalize(result.data, result));
										}
										set(result);
									});
									return unsubscribe;
								}).subscribe
							}
						});
					}
					return store;
				}
			},
			props: { client }
		};
	};
</script>

<script lang="ts">
	import { setClient } from '@urql/svelte';
	import Navbar from '../components/Navbar.svelte';

	import '../app.postcss';

	export let client: Client;
	setClient(client);
</script>

<Navbar>
	<div class="p-2 container mx-auto">
		<slot />
	</div>
</Navbar>
