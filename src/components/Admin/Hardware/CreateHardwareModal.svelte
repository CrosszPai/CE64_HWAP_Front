<script lang="ts">
	import { ADD_HARDWARE } from '$graphql/mutation/hardware.gql';

	import AppNanoid from '$lib/nanoid';
	import { mutation, operationStore } from '@urql/svelte';

	let id = '';
	let open = false;
	let disabled = false;
	const addHardwareStore = operationStore(ADD_HARDWARE);
	const mutateHardware = mutation(addHardwareStore);
	function handleRandom() {
		id = AppNanoid();
	}
	async function handleSubmit() {
		disabled = true;
		await mutateHardware({
			id
		});
		disabled = false;
		open = false;
	}
</script>

<button class="btn btn-primary modal-button" on:click={() => (open = true)}>Add Hardware</button>
<div class="modal" class:modal-open={open}>
	<div class="modal-box prose">
		<h3>เพิ่ม Hardware เข้าระบบ</h3>
		<div class="form-control">
			<label for="hw_id" class="label">
				<span class="label-text">Hardware ID</span>
			</label>
			<div class="relative">
				<input
					id="hw_id"
					type="text"
					bind:value={id}
					placeholder="Search"
					class="w-full pr-16 input input-primary input-bordered"
				/>
				<button
					on:click={handleRandom}
					class="absolute top-0 right-0 rounded-l-none btn btn-primary">Random</button
				>
			</div>
		</div>
		<div class="modal-action">
			<button disabled={disabled} on:click={handleSubmit} class="btn btn-primary"
				>เพิ่ม</button
			>
			<button class="btn" on:click={() => (open = false)}>ยกเลิก</button>
		</div>
	</div>
</div>
