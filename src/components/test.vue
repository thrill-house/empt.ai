<docs>
### Test

This is a sample component, file and folder structure should be preserved to match the example set out here.

##### Attributes
- `message` — A message to be displayed in the component
</docs>

<template>
	<div id="test">
	  {{ message }}
	</div>
</template>

<script>
	export default {
	  name: 'test',
	  props: ['message']
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#test {
		min-height: 1rem;
		padding: 1rem;
		width: 10rem;
	  background: pink;
	  text-align: center;
	}
</style>
