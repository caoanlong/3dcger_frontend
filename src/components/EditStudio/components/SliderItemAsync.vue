<template>
    <div class="slider-item">
        <Slider 
            class="slider-item-slide"
            showTip="never" 
            :label="label"
            :max="max"
            :step="step"
            :value="value" 
            @on-change="handleSlideChange">
        </Slider>
        <input class="slider-item-input" type="text" :value="value" @change="handleInputChange">
    </div>
</template>

<script>
import Slider from '@/components/Slider'
export default {
    components: {
        Slider
    },
    props: {
        value: {
            type: Number,
            default: 1
        },
        label: {
            type: String,
            default: 'label'
        },
        max: {
            type: Number,
            default: 10
        },
        step: {
            type: Number,
            default: 0.01
        }
    },
    methods: {
        handleSlideChange(val) {
            console.log(val)
            this.$emit('change', val)
        },
        handleInputChange(e) {
            this.$emit('change', +e.target.value)
        }
    },
}
</script>

<style lang="scss" scoped>
.slider-item {
    margin-top: 5px;
    display: flex;
    &-slide {
        flex: 1;
    }
    &-input {
        margin-left: 3px;
        width: 40px;
        font-size: 13px;
        color: #cbcbcb;
        border-top: 1px solid #282828;
        border-left: 1px solid #282828;
        border-right: 1px solid #323232;
        border-bottom: 1px solid #323232;
        background-color: #4d4d4d;
        appearance: none;
        outline: none;
    }
}
</style>