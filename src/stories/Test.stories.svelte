<script>
import { Meta, Story, Template } from "@storybook/addon-svelte-csf";

import Summary from "../routes/summary.svelte";
import '../app.postcss';
</script>

<Meta
  title="Summary/Sum"
  component={Summary}
/>

<Template let:args>

<div class="p-2 container mx-auto">
    <Summary
    {...args}
  />
</div>
    
  </Template>
  
<Story
  name="LoggedIn"
  args={{
  }}
/>