<script lang="ts">
	import { session } from '$app/stores';
	import type { GithubUser } from 'src/global';
	import SignInWithGithubButton from './Buttons/SignInWithGithubButton.svelte';

	// function themeChangeHandler(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
	// 	const html = document.getElementsByTagName('html').item(0);
	// 	html.setAttribute('data-theme', e.currentTarget.value);
	// }
	$: user = $session.user as GithubUser | null;
</script>

<div class="navbar mb-2 shadow-lg rounded-box">
	<div class="flex-none">
		<button class="btn btn-square btn-ghost md:hidden">
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
		</button>
	</div>
	<div class="flex-1 px-2 mx-2">
		<span class="text-lg font-bold">HW Automation</span>
	</div>
	<!-- <select on:change={themeChangeHandler} class="select select-bordered">
		<option disabled selected>Choose your theme</option>
		<option>light</option>
		<option>dark</option>
	</select> -->

	{#if user?.id}
		<div class="avatar cursor-pointer active:hover:scale-95">
			<div class="w-10 h-10 rounded-full">
				<img src={user.avatar_url} alt="user avatar" />
			</div>
		</div>
	{:else}
		<SignInWithGithubButton />
	{/if}
</div>
