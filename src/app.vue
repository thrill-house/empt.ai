<documentation>
	This is the app component that controls the display of all the child components. Generally, this won't need to be changed very often. 
</documentation>

<template>
	<main id="app">
	  <header>
		  <img src="./assets/img/logo.png" class="logo">
		  <div>
			  <h1>Dash Game — Vue components</h1>
			  <h3>This is the library of all components used to make up the user interface of the Dash Game.</h3>
		  </div>
		</header>
	  <test msgs="Testing 1 2 3"></test>
	</main>
</template>

<script>
import Test from './components/test.vue'

export default {
  name: 'app',
  data: function() {
    return {}
  },
  components: {
    Test
  }
}
</script>

<style lang="scss">
	@import './assets/scss/default';
	
	#app {
		display: grid;
		grid-gap: 2rem;
		padding: 2rem;
		
		header {
			display: grid;
			grid-template-columns: 120px 1fr;
			grid-gap: 2rem;
			
		  .logo {
				max-width: 100%;
				height: auto;
		  }
	  }
	}
</style>
