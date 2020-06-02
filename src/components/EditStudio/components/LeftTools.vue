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
import { mapGetters } from 'vuex'
export default {
    components: {
        IconBtn
    },
    computed: {
        ...mapGetters(['materials'])
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
            const material = new THREE.MeshStandardMaterial({
                metalness: 1,
                roughness: 0,
                aoMapIntensity: 0.5,
                transparent: true
            })
            objLoader.load(obj.url, (group) => {
                group.children[0].material = material
                this.$store.commit('addMesh', group)
            })
            this.$store.commit('setMaterial', material)
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