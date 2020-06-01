<template>
    <div class="icon-btn" :style="{width, height, backgroundImage: 'url(/img/' + icon + '.png)'}">
        <slot/>
    </div>
</template>

<script>
export default {
    props: {
        icon: String,
        width: {
            type: String,
            default: '20px'
        },
        height: {
            type: String,
            default: '20px'
        }
    }
}
</script>

<style lang="scss" scoped>
.icon-btn {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
        background-color: $primary-color;
    }
}
</style>