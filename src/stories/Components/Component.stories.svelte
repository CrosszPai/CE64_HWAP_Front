<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import SignInWithGithubButton from '../../components/Buttons/SignInWithGithubButton.svelte';
</script>

<Meta
	title="Component/Button"
	component={SignInWithGithubButton}
	argTypes={{
		disabled: { control: 'boolean' }
	}}
/>

<Template let:args>
	<SignInWithGithubButton {...args} />
</Template>

<Story name="Github Button" args={{ disabled: true }} />
