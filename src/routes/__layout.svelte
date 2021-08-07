<script>
	import Navbar from '../components/Navbar.svelte';

	import '../app.postcss';
</script>

<Navbar />
<div class="p-2">
	<slot />
</div>
