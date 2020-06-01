<template>
    <div class="label-select">
        <span>{{label}}</span>
        <SelectList :list="list" :current="current" @change="handleChange"></SelectList>
    </div>
</template>

<script>
import SelectList from './SelectList'
export default {
    components: {
        SelectList
    },
    props: {
        label: {
            type: String,
            default: 'label'
        },
        current: {
            type: String,
            default: 'value'
        },
        list: Array
    },
    methods: {
        handleChange(item) {
            this.$emit('change', item)
        }
    },
}
</script>

<style lang="scss" scoped>
.label-select {
    span {
        color: #c0c0c0;
        font-size: 14px;
    }
}
</style>