<template>
    <div class="btn" :class="[size]">
         {{text}}
    </div>
</template>

<script>
export default {
    props: {
        size: {
            type: String,
            default: 'normal'
        },
        text: {
            type: String,
            default: '按钮'
        }
    }
}
</script>

<style lang="scss" scoped>
.normal {
    padding: 0 35px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
}
.btn {
    display: inline-block;
	color: #ffffff;
    background-color: $btn-bg-color;
    cursor: pointer;
    &:hover {
        background-color: lighten($btn-bg-color, 5%);
    }
}
</style>