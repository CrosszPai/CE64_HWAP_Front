<script>
	import { GITHUB_CLIENT_ID } from '$lib/Env';
	export let disabled = false
</script>

<a
	href={disabled ? 'javascript:function() { return false; }':`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`}
	class="btn btn-outline"
>
	Sign In with Github
</a>
