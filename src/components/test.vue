<documentation>
	This is a sample component, file and folder structure should be preserved to match the example set out here.
	
	Properties
	msg: A message to be displayed in the component
</documentation>

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
	  background: pink;
	}
</style>
