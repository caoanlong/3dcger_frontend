<template>
    <div class="model-item" @click.stop="handleSelect">
        <div 
            class="model-item-name eclipsis" 
            :class="{'active': currentObject && currentObject.uuid == model.uuid}" >
            {{model && (model.name || model.type)}}
        </div>
        <div 
            class="model-item-children" 
            v-if="model && model.children && model.children.length && !model.children.map(it => it.type).includes('LineSegments')">
            <ModelItem 
                v-for="item in model.children" 
                :key="item.uuid" 
                :model="item">
            </ModelItem>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'ModelItem',
    props: {
        model: Object
    },
    computed: {
        ...mapGetters(['currentObject'])
    },
    methods: {
        handleSelect() {
            this.$store.commit('setCurrentObject', this.model)
        }
    },
}
</script>

<style lang="scss" scoped>
.model-item {
    border-top: 1px solid #222222;
    color: #cbcbcb;
    font-size: 14px;
    position: relative;
    &-name {
        padding-left: 12px;
        height: 20px;
        line-height: 20px;
        &:hover {
            background-color: #4a4a4a;
        }
        &.active {
            background-color: #737373;
        }
    }
    &:before {
        position: absolute;
        top: 6px;
        left: 4px;
        display: block;
        content: "";
        width: 4px;
        height: 4px;
        border-left: 1px solid #999999;
        border-bottom: 1px solid #999999;
    }
    &-children {
        padding-left: 10px;
    }
}
</style>