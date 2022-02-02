<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { CREATE_LAB } from '$graphql/mutation/labs.gql';
	import { REPOS } from '$graphql/query/github.gql';
	import { shortenFileName } from '$lib/shortenFileName';
	import { mutation, operationStore, query } from '@urql/svelte';

	let lab_name = '';
	let lab_detail = '';
	let file_input: HTMLInputElement;
	let assets: File[] = [];
	let repo_url: string;
	let published: boolean = false;

	const createLabStore = operationStore(CREATE_LAB);
	const create_lab = mutation(createLabStore);

	const repos = operationStore(REPOS);
	query(repos);

	function reset_from() {
		lab_name = '';
		lab_detail = '';
		file_input.value = '';
		assets = [];
		repo_url = '';
		published = false;
	}

	async function submit_lab() {
		await create_lab({
			lab_name,
			lab_detail,
			assets: assets,
			repo_url,
			published
		});
		reset_from();
	}

	function handle_file_drop(e: DragEvent) {
		if (e.dataTransfer.items) {
			for (let i = 0; i < e.dataTransfer.items.length; i++) {
				if (e.dataTransfer.items[i].kind === 'file') {
					assets = [...assets, e.dataTransfer.items[i].getAsFile()];
				}
			}
		}
	}

	function select_file(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const file = e.currentTarget.files[0];
		assets = [...assets, file];
		e.currentTarget.value = '';
	}

	function remove_file(index: number) {
		assets.splice(index, 1);
		assets = assets;
	}
</script>

<a href="/instructor/lab" class="back-button">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="feather feather-arrow-left"
	>
		<line x1="19" y1="12" x2="5" y2="12"></line>
		<polyline points="12 19 5 12 12 5"></polyline>
	</svg>
</a>

<div class="text-center w-full">
	<div class="p-10 card bg-base-200 h-1/2">
		<form class="form-control mb-5 mt-5" on:submit|preventDefault={submit_lab}>
			<label class="label" for="name">
				<span class="label-text">Lab Name</span>
			</label>
			<input
				id="name"
				class="input input-bordered textarea h-2/4"
				placeholder="lab name"
				bind:value={lab_name}
			/>
			<label class="label" for="detail">
				<span class="label-text">Lab detail</span>
			</label>
			<textarea id="detail" class="textarea h-2/4" placeholder="details" bind:value={lab_detail} />
			{#if $createLabStore.error}
				<p class="text-error">{$createLabStore.error.toString()}</p>
			{/if}
			<div class="mt-5">
				<div
					class="border-dashed p-4 border-2 w-full min-h-[128px] rounded grid gap-4 grid-cols-[repeat(auto-fill,8rem)]"
					class:!flex={assets.length === 0}
					class:justify-center={assets.length === 0}
					class:items-center={assets.length === 0}
					on:drop|preventDefault|stopPropagation={handle_file_drop}
					on:dragover|preventDefault={() => {}}
				>
					{#if assets.length}
						{#each assets as file, index}
							<div class="indicator">
								<div class="indicator-item badge badge-error" on:click={() => remove_file(index)}>
									x
								</div>

								{#if file.type.split('/')[0] === 'image'}
									<div class="grid w-32 h-32 bg-base-300 place-items-center">
										<img src={URL.createObjectURL(file)} alt={`file-${index}`} />
										<span class="text-sm">{shortenFileName(file.name)}</span>
									</div>
								{:else}
									<div class="grid w-32 h-32 border place-items-center">
										<img class="w-12 h-12" src={'/svg/document.svg'} alt={`file-${index}`} />
										<span class="text-sm">{shortenFileName(file.name)}</span>
									</div>
								{/if}
							</div>
						{/each}
						<div
							on:click={() => file_input.click()}
							class="grid w-32 h-32  place-items-center border border-dashed"
						>
							<img src="/svg/upload.svg" alt="upload" class="h-8" />
						</div>
					{:else}
						<img src="/svg/upload.svg" alt="upload" class="h-8 mr-2" />
						<p class="block text-grey">
							Click or Drop your assets
							<span on:click={() => file_input.click()} class="text-info cursor-pointer underline"
								>here</span
							>
						</p>
					{/if}
					<input
						bind:this={file_input}
						accept="image/* .pdf .docx .doc"
						on:change|preventDefault={select_file}
						type="file"
						class="hidden"
						multiple
					/>
				</div>
			</div>
			<label class="mt-4 w-full text-left">
				<p class="inline mr-2">Select Template Repository</p>
				<select
					class="select select-bordered w-full max-w-xs mt-4"
					on:change|preventDefault={(e) => {
						if (e.currentTarget.value === 'link')
							goto('https://github.com/apps/HWAP-CE/installations/new');
					}}
					bind:value={repo_url}
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
			</label>
			<div class="flex items-center justify-end">
				<label for="publish" class="cursor-pointer label">
					<span class="label-text ml-auto mr-2">{published ? 'Publish' : 'Draft'}</span>
				</label>
				<input id="publish" type="checkbox" bind:checked={published} class="toggle toggle-accent" />
			</div>

			<button
				aria-label="submit-lab"
				class="btn btn-primary self-end btn mt-5"
				class:!btn-outline={!published}
				role="button"
				aria-pressed="true">{published ? 'Publish' : 'Save'}</button
			>
		</form>
	</div>
</div>
