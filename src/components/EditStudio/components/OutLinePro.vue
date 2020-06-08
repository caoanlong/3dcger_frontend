<template>
    <div class="outline-pro" :style="{height: height + 'px'}">
        <component v-if="currentObject" :is="currentCom"></component>
        <NoSelection v-else/>
    </div>
</template>
<script>
import NoSelection from './NoSelection'
import ScenePro from './ScenePro'
import RenderPro from './RenderPro'
import CameraPro from './CameraPro'
import GroupPro from './GroupPro'
import MeshPro from './MeshPro'
import { mapGetters } from 'vuex'
export default {
    components: {
        ScenePro,
        RenderPro,
        CameraPro,
        GroupPro,
        MeshPro,
        NoSelection
    },
    props: {
        height: {
            type: Number,
            default: 350
        }
    },
    computed: {
        ...mapGetters(['currentObject']),
        currentCom() {
            if (this.currentObject && this.currentObject.type) {
                const type = this.currentObject.type.toLowerCase()
                if (type.includes('scene')) return 'ScenePro'
                if (type.includes('render')) return 'RenderPro'
                if (type.includes('camera')) return 'CameraPro'
                if (type.includes('group')) return 'GroupPro'
                if (type.includes('mesh')) return 'MeshPro'
            }
            return 'ScenePro'
        }
    },
}
</script>
<style lang="scss" scoped>
.outline-pro {
    border: 1px solid #262626;
    background-color: #383838;
}
</style>