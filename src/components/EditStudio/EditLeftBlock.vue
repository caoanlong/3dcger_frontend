<template>
    <div class="edit-left">
        <LeftTools @save="$emit('save')"/>
        <OutLine :height="outLineHeight"/>
        <Split i="1" @change="handleSplitChange"/>
        <OutLinePro :height="height - outLineHeight - 15 - 28"/>
    </div>
</template>

<script>
import LeftTools from './components/LeftTools'
import OutLine from './components/OutLine'
import Split from './components/Split'
import OutLinePro from './components/OutLinePro'
const INIT_OUTLINE_HEIGHT = 250
export default {
    components: {
        LeftTools,
        OutLine,
        Split,
        OutLinePro
    },
    props: {
        height: Number
    },
    data() {
        return {
            outLineHeight: INIT_OUTLINE_HEIGHT
        }
    },
    methods: {
        handleSplitChange(dis) {
            this.outLineHeight = INIT_OUTLINE_HEIGHT + dis
        }
    },
}
</script>

<style lang="scss" scoped>
.edit-left {
    height: 100%;
    padding: 0 4px;
    overflow: hidden;
    background-color: #343434;
}
</style>