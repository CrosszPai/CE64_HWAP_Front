<script>
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

	import Summary from '../routes/summary.svelte';
	import '../app.postcss';
	import StoriesLayout from './StoriesLayout.svelte';
</script>

<Meta title="Page/Summary" component={Summary} />

<Template let:args>
	<StoriesLayout>
		<Summary {...args} />
	</StoriesLayout>
</Template>

<Story name="Sammary" args={{}} />
