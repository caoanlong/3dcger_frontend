<template>
    <div class="edit">
        <EditStudio/>
    </div>
</template>

<script>
import EditStudio from '@/components/EditStudio'
export default {
    name: 'Edit',
    components: {
        EditStudio
    },
    destroyed() {
        this.$store.commit('reset')
    },
}
</script>

<style lang="scss" scoped>
.edit {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>