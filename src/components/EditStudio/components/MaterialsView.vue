<template>
    <div class="materials" :style="{height: height + 'px'}">
        
    </div>
</template>

<script>
export default {
    props: {
        height: {
            type: Number,
            default: 250
        }
    }
}
</script>

<style lang="scss" scoped>
.materials {
    border: 1px solid #262626;
}
</style>