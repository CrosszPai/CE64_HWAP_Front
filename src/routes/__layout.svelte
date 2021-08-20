<script context="module">
	import { get, readable } from 'svelte/store';
	import { Client, operationStore } from '@urql/svelte';
	import { browser, dev } from '$app/env';
	import { createClient } from '$lib/graphql/client';

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch, context }) {
		const client = await createClient({
			url: 'https://api.spacex.land/graphql/',
			fetch,
			dev: browser && dev
		});
		return {
			context: {
				...context,
				client,
				// Works just like query from @urql/svelte
				query: async (query, variables, context, normalize) => {
					if (typeof variables == 'function') {
						[normalize, variables = undefined, context = undefined] = [variables];
					} else if (typeof context == 'function') {
						[normalize, context = undefined] = [context];
					}

					const store = operationStore(query, variables, context);
					const result = await client
						.query(store.query, store.variables, store.context)
						.toPromise();
					Object.assign(get(store), result);

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
	}
</script>

<script lang="ts">
	import { setClient } from '@urql/svelte';
	import Navbar from '../components/Navbar.svelte';

	import '../app.postcss';

	export let client: Client;
	setClient(client);
</script>

<Navbar />
<div class="p-2 container">
	<slot />
</div>
