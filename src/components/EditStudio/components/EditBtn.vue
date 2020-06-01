<template>
    <div class="edit-btn">
        {{text}}
        <slot/>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: 'button'
        }
    }
}
</script>

<style lang="scss" scoped>
.edit-btn {
    display: inline-block;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 14px;
    color: #cbcbcb;
    padding: 0 10px;
    background-color: #4d4d4d;
    cursor: pointer;
    position: relative;
    &:hover {
        background-color: $primary-color;
    }
}
</style>