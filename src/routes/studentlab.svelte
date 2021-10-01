<script>
	import { CREATE_LAB } from '$graphql/mutation/labs.gql';

	import { mutation } from '@urql/svelte';

	const create_lab = mutation({
		query: CREATE_LAB
	});
	let lab_name = '';
	let lab_detail = '';
	function submit_lab(e) {
		console.log(lab_name, lab_detail);
		create_lab({
			lab_name,
			lab_detail
		});
	}
</script>

<div class="card lg:card-side bordered shadow-lg flex">
	<div class="card-body flex flex-col">
		<h2 class="card-title text-4xl mt-5 text-purple-600">lab name</h2>
		<p class="ml-10 mt-5">lab details</p>
	</div>
</div>
<div class="card-body flex flex-col shadow-lg ">
	<div class="flex flex-col">
		<div class="justify-items-start">
			<input type="checkbox" checked="checked" class="checkbox" /> test case 1
		</div>
		<div class="justify-items-start">
			<input type="checkbox" checked="checked" class="checkbox" /> test case 2
		</div>
		<div class="justify-items-start">
			<input type="checkbox" checked="checked" class="checkbox" /> test case 3
		</div>
	</div>
</div>
<button class="btn btn-primary btn-active self-end btn mt-5" role="button" aria-pressed="true"
	>Submit</button
>
