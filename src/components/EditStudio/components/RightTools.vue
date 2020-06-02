<template>
    <div class="right-tools">
        <!-- <IconBtn class="import-model" icon="icon_import_model" title="Import Model">
            <input type="file" @change="handleImportModel"/>
        </IconBtn> -->
    </div>
</template>

<script>
import IconBtn from './IconBtn'
export default {
    components: {
        IconBtn
    },
    methods: {
        // handleImportModel() {
        //     console.log(fileReader)
        // }
    },
}
</script>

<style lang="scss" scoped>
.right-tools {
    height: 28px;
    padding: 0 6px;
    display: flex;
    align-items: center;
    .import-model {
        input {
            width: 100%;
            height: 100%;
            opacity: 0;
            filter: opacity(0);
        }
    }
}
</style>