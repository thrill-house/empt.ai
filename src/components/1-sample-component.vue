<docs>
### Sample component
This is a sample component, file and folder structure should be preserved to match the example set out here. Docs can be directly edited in the component itself. **Tweakers** can be added manually in the app component, to allow interaction with the component to demonstrate functionality. Component names should always be made up of two words, e.g. **sample-component**, so as to more easily distinguish them from standard HTML elements.

##### Properties
- `message` — A message to be displayed in the component

##### Instantiation
`<sample-component message="Hey there!"></sample-component>`
</docs>

<template>
	<div id="sample-component">
	  {{ message }}
	</div>
</template>

<script>
	export default {
	  name: 'sample-component',
	  props: ['message']
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#sample-component {
		min-height: 1rem;
		padding: 1rem;
		width: 10rem;
	  background: $peach;
	  text-align: center;
	}
</style>
