<template>
    <div class="edit-right">
        <!-- <RightTools/> -->
        <MaterialsView :height="materialsHeight"/>
        <Split i="2" @change="handleSplitChange"/>
        <MaterialsPro :height="height - materialsHeight - 15" v-if="isShowMaterialsPro"/>
    </div>
</template>

<script>
import RightTools from './components/RightTools'
import MaterialsView from './components/MaterialsView'
import Split from './components/Split'
import MaterialsPro from './components/MaterialsPro'
import { mapGetters } from 'vuex'
const INIT_MATERIALS_HEIGHT = 250
// const INIT_MATERIALS_HEIGHT = 272
export default {
    components: {
        RightTools,
        MaterialsView,
        Split,
        MaterialsPro
    },
    props: {
        height: Number
    },
    data() {
        return {
            materialsHeight: INIT_MATERIALS_HEIGHT,
            isShowMaterialsPro: true
        }
    },
    computed: {
        ...mapGetters(['currentMaterial'])
    },
    watch: {
        currentMaterial(val) {
            this.isShowMaterialsPro = false
            this.$nextTick(() => {
                this.isShowMaterialsPro = true
            })
        }
    },
    methods: {
        handleSplitChange(dis) {
            this.materialsHeight = INIT_MATERIALS_HEIGHT + dis
        }
    },
}
</script>

<style lang="scss" scoped>
.edit-right {
    height: 100%;
    padding: 0 4px;
    overflow: hidden;
    background-color: #343434;
}
</style>