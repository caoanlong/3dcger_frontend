<template>
    <div class="color-select">
        <div class="color-select-block" :style="`background-color:${color.includes('#') ? color : '#' + color}`">
            <input 
                class="color-select-block-input" 
                type="color"
                :value="color.includes('#') ? color : '#' + color" 
                @change="handleColorChange($event)"/>
        </div>
        <div class="color-select-label">{{label}}</div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: 'Color'
        },
        color: {
            type: String,
            default: '#ffffff'
        }
    },
    methods: {
        handleColorChange(e) {
            this.$emit('change', e.target.value)
        }
    },
}
</script>

<style lang="scss" scoped>
.color-select {
    display: flex;
    &-block {
        width: 18px;
        height: 18px;
        position: relative;
        overflow: hidden;
        &-input {
            width: 18px;
            height: 18px;
            opacity: 0;
            filter: opacity(0);
        }
    }
    &-label {
        height: 18px;
        line-height: 18px;
        padding: 0 5px;
        font-size: 12px;
        color: #cbcbcb;
    }
}
</style>