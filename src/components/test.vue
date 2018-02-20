<documentation>
	This is a sample component, file and folder structure should be preserved to match the example set out here. 
</documentation>

<template>
	<div id="test">
	  {{ msgs }}
	</div>
</template>

<script>
	export default {
	  name: 'test',
	  props: ['msgs']
	}
</script>

<style lang="scss">
	@import '../assets/scss/variables';
	
	#test {
	  background: pink;
	}
</style>
