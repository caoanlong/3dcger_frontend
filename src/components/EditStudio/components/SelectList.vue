<template>
    <div class="select">
        <svg 
            class="select-icon"
            xmlns="http://www.w3.org/2000/svg" 
            version="1.1" 
            width="10" 
            height="5">
            <path d="M0 0 L10 0 L5 6 Z" style="fill:#d9d9d9"></path>
        </svg>
        {{current}}
        <div class="select-list">
            <div 
                class="select-list-item" 
                v-for="(item, i) in list" 
                :key="i" 
                @click="handleSelect(item)">
                <svg-icon 
                    className="select-list-item-gou" 
                    icon-class="gou" 
                    :style="{'visibility': item === current ? 'visible' : 'hidden'}">
                </svg-icon>
                {{item}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        current: {
            type: String,
            default: 'value'
        },
        list: Array
    },
    methods: {
        handleSelect(item) {
            this.$emit('change', item)
        }
    },
}
</script>

<style lang="scss" scoped>
.select {
    display: inline-block;
    color: #959595;
    font-size: 14px;
    padding-left: 5px;
    position: relative;
    &-icon {
        position: relative;
        top: -3px;
    }
    &:hover {
        .select-list {
            display: block;
        }
    }
    &-list {
        display: none;
        position: absolute;
        top: 0;
        left: 16px;
        z-index: 1;
        min-width: 100px;
        font-size: 12px;
        background-color: #4d4d4d;
        &-item {
            color: #cbcbcb;
            height: 20px;
            line-height: 20px;
            padding: 0 5px;
            position: relative;
            &:hover {
                background-color: #6c6c6c;
                &:before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    content: "";
                    display: block;
                    width: 3px;
                    height: 20px;
                    background-color: $primary-color;
                }
            }
            &-gou {
                margin: 0 5px;
                font-size: 16px;
                position: relative;
                top: 2px;
            }
        }
    }
}
</style>