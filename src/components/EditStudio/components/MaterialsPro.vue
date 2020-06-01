<template>
    <div class="materials-pro" :style="{height: height + 'px'}">
        <NoSelection/>
    </div>
</template>
<script>
import NoSelection from './NoSelection'
export default {
    components: {
        NoSelection
    },
    props: {
        height: {
            type: Number,
            default: 350
        }
    }
}
</script>
<style lang="scss" scoped>
.materials-pro {
    border: 1px solid #262626;
    background-color: #383838;
}
</style>