<script>
	import { session } from '$app/stores';

	console.log($session.user);
</script>

<div class="card lg:card-side bordered shadow-lg flex flex-col">
	<div class="card-body flex flex-col">
		<h2 class="card-title text-4xl mt-5 text-purple-600">Lab Name</h2>
		<p class="ml-10 mt-5">Lab Detail</p>
	</div>

	<div class="card-body flex flex-col">
		<h2 class="card-title">
			Test Cases
			<div class="badge badge-success ml-3">success</div>
		</h2>
		<div>
			<input type="checkbox" checked class="checkbox mr-2" /> test case 1
		</div>
		<div>
			<input type="checkbox" checked class="checkbox mr-2" /> test case 2
		</div>
		<div>
			<input type="checkbox" checked class="checkbox mr-2" /> test case 3
		</div>
	</div>
</div>

<!-- <div class="flex flex-col items-center">
	<div class="card lg:card-side bordered shadow-lg mt-5 mb-5 w-1/2">
		<div class="card-body">
			<h2 class="card-title">
				Test Cases
				<div class="badge badge-success ml-3">success</div>
			</h2>
			<div>
				<input type="checkbox" checked class="checkbox mr-2" /> test case 1
			</div>
			<div>
				<input type="checkbox" checked class="checkbox mr-2" /> test case 2
			</div>
			<div>
				<input type="checkbox" checked class="checkbox mr-2" /> test case 3
			</div>
		</div>
	</div>
</div> -->
