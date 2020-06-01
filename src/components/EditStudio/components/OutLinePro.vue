<template>
    <div class="outline-pro" :style="{height: height + 'px'}">
        <component v-if="currentOutlineItem" :is="OUTLINE_MAP[currentOutlineItem]"></component>
        <NoSelection v-else/>
    </div>
</template>
<script>
import NoSelection from './NoSelection'
import SkyPro from './SkyPro'
import { mapGetters } from 'vuex'
const OUTLINE_MAP = {
    Scene: 'ScenePro',
    Render: 'RenderPro',
    Camera: 'CameraPro',
    Sky: 'SkyPro',
}
export default {
    components: {
        SkyPro,
        NoSelection
    },
    props: {
        height: {
            type: Number,
            default: 350
        }
    },
    data() {
        return {
            OUTLINE_MAP
        }
    },
    computed: {
        ...mapGetters(['currentOutlineItem'])
    },
}
</script>
<style lang="scss" scoped>
.outline-pro {
    border: 1px solid #262626;
    background-color: #383838;
}
</style>