<script lang="ts">
	import { browser } from '$app/env';

	import { goto } from '$app/navigation';

	import { session } from '$app/stores';
	import type { User } from 'src/global';
	import SignInWithGithubButton from './Buttons/SignInWithGithubButton.svelte';

	$: user = $session.user as User | null;
	$: {
		if (!!user.id && browser) {
			console.log(user.id);
			// goto('/');
		}
	}
</script>

<div class="navbar mb-2 shadow-lg rounded-box">
	<div class="flex-none">
		<div class="btn btn-square btn-ghost md:hidden">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block w-6 h-6 stroke-current"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</div>
	</div>
	<div class="flex-1 px-2 mx-2">
		<a href="/" class="text-lg font-bold">HW Automation</a>
	</div>
	<!-- <select on:change={themeChangeHandler} class="select select-bordered">
		<option disabled selected>Choose your theme</option>
		<option>light</option>
		<option>dark</option>
	</select> -->

	{#if user?.role === 'admin'}
		<a href="/admin" class="mr-4 link">Admin Page</a>
	{/if}
	{#if user?.id}
		<div class="dropdown dropdown-end">
			<div tabindex="0" class="avatar w-10 h-10 cursor-pointer active:hover:scale-95">
				<img class="mask mask-squircle" src={user.avatar_url} alt="user avatar" />
			</div>
			<ul tabindex="1" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
				<li>
					<a href="/logout">Loggout</a>
				</li>
			</ul>
		</div>
	{:else}
		<SignInWithGithubButton />
	{/if}
</div>
