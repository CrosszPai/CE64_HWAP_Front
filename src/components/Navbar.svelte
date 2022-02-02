<script lang="ts">
	import { goto } from '$app/navigation';

	import { page, session } from '$app/stores';
	import type { User } from 'src/global';
	import SignInWithGithubButton from './Buttons/SignInWithGithubButton.svelte';

	$: user = $session.user as User | null;
</script>

<div class="rounded-lg shadow drawer h-screen">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="flex flex-col drawer-content">
		<div class="w-full navbar">
			<div class="flex-none lg:hidden">
				<label for="my-drawer-3" class="btn btn-square btn-ghost">
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
				</label>
			</div>
			<div class="flex-1 px-2 mx-2">
				<a href="/"> HW Automation </a>
				{#if user?.role === 'admin'}
					<a href="/admin" class="mx-4 link hidden md:block">Admin</a>
					<a href="/instructor/lab" class="mx-4 link hidden md:block">Instructor</a>
				{/if}
			</div>
			{#if user?.id}
				<div class="flex-none dropdown dropdown-end hidden md:block">
					<div class="flex items-center">
						<p class="mr-4">{user.name}</p>
						<div tabindex="0" class="avatar flex w-10 h-10 cursor-pointer active:hover:scale-95">
							<img class="mask mask-squircle" src={user.avatar_url} alt="user avatar" />
						</div>
					</div>
					<ul
						tabindex="0"
						class="p-2 top-10 shadow menu dropdown-content bg-base-100 rounded-box w-52"
					>
						<li>
							<a href="/">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								Profile</a
							>
						</li>
						<li>
							<a href="/logout">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Loggout</a
							>
						</li>
					</ul>
				</div>
			{:else}
				<div class="flex-none">
					<SignInWithGithubButton />
				</div>
			{/if}
		</div>
		<slot />
	</div>
	<div class="drawer-side">
		<label for="my-drawer-3" class="drawer-overlay" />
		<ul class="p-4 overflow-y-auto menu w-80 bg-base-100">
			{#if user?.id}
				<li>
					<div class="flex items-center">
						<div class="avatar flex w-10 h-10 cursor-pointer active:hover:scale-95">
							<img class="mask mask-squircle" src={user.avatar_url} alt="user avatar" />
						</div>
						<div>
							<p class="ml-4">{user.name}</p>
							{#if $page.path.includes('admin')}
								<a href="/" class="mx-4 link">สลับไปหน้าปกติ</a>
							{:else}
								<a href="/admin" class="mx-4 link">สลับไปหน้า Admin</a>
							{/if}
						</div>
					</div>
				</li>
			{:else}
				<li>
					<SignInWithGithubButton />
				</li>
			{/if}
			{#if user?.id}
				<li class="mt-auto">
					<p on:click={(e) => goto('/logout')}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>Loggout
					</p>
				</li>
			{/if}
		</ul>
	</div>
</div>
