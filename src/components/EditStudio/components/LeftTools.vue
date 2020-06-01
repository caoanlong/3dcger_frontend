<template>
    <div class="left-tools">
        <IconBtn class="import-model" icon="icon_import_model" title="Import Model">
            <input type="file" @change="handleImportModel"/>
        </IconBtn>
    </div>
</template>

<script>
import IconBtn from './IconBtn'
import '@/utils/OBJLoader'
const objDefaultParams = {
    metalness: 1,
    roughness: 0,
    aoMapIntensity: 0.5,
    transparent: true
}
export default {
    components: {
        IconBtn
    },
    methods: {
        handleImportModel(e) {
            const file = e.target.files[0]
            const obj = {
                file,
                fileName: file.name,
                url: window.URL.createObjectURL(file)
            }
            const objLoader = new THREE.OBJLoader()
            objLoader.load(obj.url, (group) => {
                group.children[0].material = new THREE.MeshStandardMaterial(objDefaultParams)
                this.$store.commit('addMesh', group)
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.left-tools {
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