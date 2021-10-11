<script>
	import { session } from '$app/stores';

	console.log($session.user);
</script>

<div class="card lg:card-side bordered shadow-lg mt-5">
	<figure>
		<img
			src={$session.user.avatar_url}
			class="w-[200px] h-[200px]"
			alt="profile"
			width="200"
			height="200"
		/>
	</figure>
	<div class="card-body mt-3">
		<h2 class="card-title">Name : {$session.user.name}</h2>
		<h2 class="card-title">ID : 61010260</h2>
		<h2 class="card-title">Email : {$session.user.email}</h2>
	</div>
</div>

<div class="flex flex-col items-center">
	<div class="card lg:card-side bordered shadow-lg mt-5 mb-5 w-1/2">
		<div class="card-body">
			<h2 class="card-title">
				Lab 1
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
</div>
