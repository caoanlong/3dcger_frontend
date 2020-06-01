<template>
	<div id="app">
		<HeaderTop/>
		<router-view/>
		<notifications group="foo" position="top center"/>
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
	background-color: #f2f2f2;
	position: relative;
	padding-top: $header-height;
}
</style>