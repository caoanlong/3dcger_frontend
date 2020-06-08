<template>
    <div class="materials clearfix" :style="{height: height + 'px'}">
        <MaterialItem 
            class="materials-item" 
            v-for="(item, i) in materials" 
            :key="i" 
            :material="item" 
            :isActive="currentMaterial.uuid == item.uuid" >
        </MaterialItem>
    </div>
</template>

<script>
import MaterialItem from './MaterialItem'
import { mapGetters } from 'vuex'
export default {
    components: {
        MaterialItem
    },
    props: {
        height: {
            type: Number,
            default: 250
        }
    },
    computed: {
        ...mapGetters(['materials', 'currentMaterial'])
    },
}
</script>

<style lang="scss" scoped>
.materials {
    border: 1px solid #262626;
    padding: 5px;
    overflow: auto;
    &-item {
        float: left;
        margin-left: 5px;
        margin-bottom: 5px;
        &:first-child {
            margin-left: 0;
        }
    }
}
</style>