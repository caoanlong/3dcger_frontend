<template>
    <div class="btn" :class="{'disabled': disabled}">{{text}}<slot/></div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: 'Button'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    display: inline-block;
    height: 20px;
    line-height: 18px;
    padding: 0 5px;
    color: #eeeeee;
    font-size: 13px;
    border: 1px solid #444444;
    border-radius: 2px;
    background-image: linear-gradient(#888888, #666666);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    &:hover {
        background-image: linear-gradient(#a1a1a1, #858585);
    }
    &.disabled {
        color: #aaaaaa;
        background-image: linear-gradient(#a1a1a1, #858585);
        cursor: not-allowed;
    }
}
</style>