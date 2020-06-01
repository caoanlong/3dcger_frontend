<template>
    <div class="fold">
        <div class="fold-label" @click="handleClick">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                version="1.1" 
                width="10" 
                height="6"
                :style="`transform:rotate(${visible ? '0deg' : '-90deg'})`">
                <path d="M0 0 L10 0 L5 6 Z" style="fill:#d9d9d9"></path>
            </svg>
            {{label}}
        </div>
        <slot/>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: 'fold'
        },
        visible: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        handleClick() {
            this.$emit('click', !this.visible)
        }
    },
}
</script>

<style lang="scss" scoped>
.fold {
    user-select: none;
    margin-bottom: 1px;
    &-label {
        height: 20px;
        line-height: 20px;
        color: #f7f7f7;
        font-size: 14px;
        background-color: #737373;
        padding-left: 5px;
        svg {
            position: relative;
            top: -2px;
            transition: transform 0.2s;
        }
    }
}
</style>