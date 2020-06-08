<template>
    <div class="left-tools">
        <Btn 
            class="import-model" 
            text="Import" 
            title="Import Model" 
            :disabled="isDisabled" 
            :style="{'visibility': isDisabled ? 'hidden' : 'visible'}">
            <input type="file" @change="handleImportModel" v-if="!isDisabled"/>
        </Btn>
        <Btn 
            class="save-scene" 
            text="Save" 
            title="Save Scene" 
            @click.native="$emit('save')">
        </Btn>
    </div>
</template>

<script>
import Btn from './Btn'
import { mapGetters } from 'vuex'
import { material }  from '@/utils/common'
export default {
    components: {
        Btn
    },
    data() {
        return {
            isDisabled: false
        }
    },
    computed: {
        ...mapGetters(['materials'])
    },
    created() {
        if (this.$route.query.id) this.isDisabled = true
    },
    methods: {
        handleImportModel(e) {
            if (!e.target.value) return
            const file = e.target.files[0]
            const fileUrl = window.URL.createObjectURL(file)
            const objLoader = new THREE.OBJLoader()
            objLoader.load(fileUrl, (group) => {
                group.cgersFile = file
                group.cgersFileUrl = fileUrl
                this.walk(group)
                // group.scale.set(0.3, 0.3, 0.3)
                this.$store.commit('addMesh', group)
                this.$store.commit('setCurrentMaterial', this.materials[0])
            })
        },
        walk(group) {
            for (let i = 0; i < group.children.length; i++) {
                const item = group.children[i]
                const mtl = material.clone()
                if (item.type === 'Mesh') {
                    mtl.geoName = item.name
                    item.material = mtl
                    this.$store.commit('setMaterial', {uuid: item.uuid, material: mtl })
                }
                if (item.children && item.children.length && item.type != 'LineSegments') {
                    this.walk(item)
                }
            }
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
    justify-content: space-between;
    .import-model {
        input {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            opacity: 0;
            filter: opacity(0);
        }
    }
    .save-scene {

    }
}
</style>