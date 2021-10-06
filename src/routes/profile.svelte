<script>
	import { session } from '$app/stores';

	console.log($session.user);
</script>

<div class="card lg:card-side bordered shadow-lg mt-5">
	<figure>
		<img src={$session.user.avatar_url} class="w-[200px] h-[200px]" alt="profile" width="200" height="200"/>
	</figure>
	<div class="card-body mt-3">
		<h2 class="card-title">Name : {$session.user.name}</h2>
		<h2 class="card-title">ID : 61010260</h2>
		<h2 class="card-title">Email : {$session.user.email}</h2>
	</div>
</div>

<div class="card lg:card-side bordered shadow-lg mt-5 mb-5">
	<div class="card-body">
		<h2 class="card-title">Lab 1</h2>
		<p>details of Lab 1</p>
	</div>
</div>

<div class="card lg:card-side bordered shadow-lg mt-5 mb-5">
	<div class="card-body">
		<h2 class="card-title">Lab 2</h2>
		<p>details of Lab 2</p>
	</div>
</div>

<div class="card lg:card-side bordered shadow-lg mt-5 mb-5">
	<div class="card-body">
		<h2 class="card-title">Lab 3</h2>
		<p>details of Lab 3</p>
	</div>
</div>
