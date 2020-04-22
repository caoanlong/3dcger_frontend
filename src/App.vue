<template>
	<div id="app">
		<HeaderTop/>
		<router-view/>
	</div>
</template>
<script>
import HeaderTop from '@/components/HeaderTop'
export default {
	components: {
		HeaderTop
	}
}
</script>
<style lang="scss" scoped>
#app {
	width: 100%;
	height: 100%;
	background-color: #1f1f1f;
	position: relative;
	padding-top: $header-height;
}
</style>