<script context="module" lang="ts">
	import { get, readable } from 'svelte/store';
	import { Client, operationStore } from '@urql/svelte';
	import { browser, dev } from '$app/env';
	import { createClient } from '$lib/graphql';
	import type { Load } from '@sveltejs/kit';
	import { GRAPHQL_ENDPOINT } from '$lib/Env';

	export const load: Load = async ({ fetch, stuff, session }) => {
		if (session.user.role !== 'admin' || !session.user.role) {
			return {
				status: 301,
				redirect: '/'
			};
		}
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
	import Navbar from '$components/Navbar.svelte';

	import '../../app.postcss';
	import { page } from '$app/stores';

	export let client: Client;
	setClient(client);
</script>

<div data-theme="cupcake">
	<Navbar>
		<div class="flex-auto p-2 mx-auto container">
			<div class="grid gap-4 h-full grid-rows-[auto,1fr] md:grid-cols-[min-content,1fr]">
				<ul
					class="menu place-self-center md:place-self-start mt-0 md:mt-16 w-[min-content] horizontal md:vertical h-[min-content] shadow-lg bg-base-100 rounded-box"
				>
					<li class:bordered={$page.path === '/admin/users' || $page.path === '/admin'}>
						<a href="/admin/users"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 mr-2 inline-block"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg> <span class="border-none lg:block hidden">Users</span>
						</a>
					</li>
					<li class:bordered={$page.path === '/admin/hardware'}>
						<a href="/admin/hardware"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 inline-block mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
								/>
							</svg> <span class="border-none lg:block hidden">Hardwares</span>
						</a>
					</li>
					<li class:bordered={$page.path === '/admin/working'}>
						<a href="/admin/working"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 inline-block mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
								/>
							</svg> <span class="border-none lg:block hidden">Working</span>
						</a>
					</li>
				</ul>
				<div class="flex flex-col" >
					<slot />
				</div>
			</div>
		</div>
	</Navbar>
</div>
