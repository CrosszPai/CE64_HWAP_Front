<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Client } from '@urql/core';
	import { LAB } from '$graphql/query/labs.gql';
	export const load: Load<{
		stuff: Client;
	}> = async ({ stuff, page }) => {
		console.log(stuff.query);
		return {
			props: {
				initialLab: await stuff.query(LAB, {
					id: parseFloat(page.params.id)
				})
			}
		};
	};
</script>

<script lang="ts">
	import { shortenFileName } from '$lib/shortenFileName';
	import { mutation, operationStore, query } from '@urql/svelte';
	import { REPOS } from '$graphql/query/github.gql';
	import { goto } from '$app/navigation';
	import { ADD_WORKING } from '$graphql/mutation/working.gql';
	import { render as render_gh } from 'github-buttons';
	import type { Lab } from 'src/global';

	export let initialLab;
	let repo: string = '';
	let lab: Lab = initialLab.data.lab;

	const addWorkingStore = operationStore(ADD_WORKING);
	const addWorking = mutation(addWorkingStore);
	function addWorkingHandler() {
		addWorking({
			lab: lab.id.toString(),
			repo
		}).then(() => {
			goto('/student');
		});
	}

	const repos = operationStore(REPOS);
	query(repos);

	function checkURL(url) {
		return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
	}
	function renderGithubButton(node, opt) {
		if (typeof window !== 'undefined') {
			render_gh(opt, (el) => {
				node.appendChild(el);
			});
		}

		return {
			destroy() {
				// the node has been removed from the DOM
			}
		};
	}
</script>

{#if lab}
	<div class="card lg:card-side bordered shadow-lg">
		<div class="card-body">
			<h2 class="card-title text-4xl mt-5 text-purple-600">{lab.lab_name}</h2>
			<p class="mt-5 whitespace-pre-line">{lab.lab_detail}</p>
			<div
				use:renderGithubButton={{
					href: lab.repo_url + '/fork',
					title: 'fork',
					'data-icon': 'octicon-repo-forked',
					'data-text': 'fork template',
					'data-size': 'large'
				}}
				class="ml-auto"
			/>
		</div>
	</div>
	<div class="card shadow-lg mt-5 mb-5">
		<div class="card-body">
			<div class="card-title">assets</div>
			<div class="grid gap-4 grid-cols-[repeat(auto-fill,8rem)]">
				{#each lab.assets as asset, i}
					<a target="__blank" href={asset.url} class="grid w-32 h-32 border place-items-center">
						<img
							class="w-12 h-12"
							src={checkURL(asset.url) ? asset.url : '/svg/document.svg'}
							alt={`file-${i}`}
						/>
						<span class="text-sm">{shortenFileName(asset.url.split('/').pop())}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="mt-10 mb-5">
		<select
			class="select select-bordered w-full max-w-xs"
			on:focus={() => {
				repos.reexecute({ requestPolicy: 'cache-and-network' });
			}}
			on:change|preventDefault={(e) => {
				if (e.currentTarget.value === 'link') {
					goto('https://github.com/apps/HWAP-CE/installations/new');
				} else {
					repo = e.currentTarget.value;
				}
			}}
		>
			{#if $repos.fetching}
				<option disabled selected>Choose your repo</option>
				<option disabled>fetching</option>
			{:else if $repos.error}
				<option disabled selected>Choose your repo {$repos.error}</option>
				<option value="link"> Install App to use github repository </option>
			{:else if $repos.data.repos}
				<option disabled selected>Choose your repo</option>
				{#each $repos.data.repos as repo (repo.id)}
					<option value={repo.html_url}>{repo.name}</option>
				{/each}
			{/if}
		</select>
		<button on:click={addWorkingHandler} class="btn ml-2 btn-primary">Link with lab.</button>
	</div>
{/if}
