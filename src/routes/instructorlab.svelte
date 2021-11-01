<script>
	import { CREATE_LAB } from '$graphql/mutation/labs.gql';

	import { mutation, operationStore } from '@urql/svelte';

	
	const createLabStore = operationStore(CREATE_LAB)
	const create_lab = mutation(createLabStore);
	let lab_name = '';
	let lab_detail = '';
	function submit_lab(e) {
		create_lab({
			lab_name,
			lab_detail
		});
	}
</script>

<div class="text-center w-full">
	<div class="p-10 card bg-base-200 h-1/2">
		<form class="form-control mb-5 mt-5" on:submit|preventDefault={submit_lab}>
			<textarea class="textarea h-2/4 mt-5" placeholder="lab name" bind:value={lab_name} />
			<textarea class="textarea h-2/4 mt-5" placeholder="details" bind:value={lab_detail} />
			{#if $createLabStore.error}
			<p class="text-error" >{$createLabStore.error.toString()}</p>
			{/if}
			<button
				aria-label="submit-lab"
				class="btn btn-primary btn-active self-end btn mt-5"
				role="button"
				aria-pressed="true">Submit</button
			>
		</form>
	</div>
</div>
