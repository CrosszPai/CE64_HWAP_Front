<script lang="ts">
	import { operationStore, query } from '@urql/svelte';
	let value = `{
  launchesPast(limit: 1) {
    mission_name
    launch_date_local
    launch_site {
      site_name_long
    }
    links {
      article_link
      video_link
    }
  }
}`;
	let newData = undefined;
	$: {
		try {
			newData = operationStore(value);
			query(newData);
		} catch (error) {}
	}
</script>

<div class="py-12 bg-white">
	<h1 class="text-2xl">Usage grapql</h1>
	<p>API from spaceX</p>
</div>
<div class="flex">
	<div class="w-1/2">
		{#if newData !== undefined}
			{#if $newData.data}
				<pre
					class="whitespace-pre-wrap max-h-[300px] overflow-scroll break-words">{JSON.stringify($newData.data,undefined,2)}</pre>
			{/if}
		{/if}
	</div>
	<textarea
		class="textarea textarea-bordered text-primary"
		bind:value
		name="query"
		cols="30"
		rows="10"
	/>
</div>
