<template>
    <div class="edit-studio">
        <div 
            id="scene" 
            class="edit-studio-main" 
            :style="{height: sceneHeight + 'px'}">
            <model-viewer
                id="modelViewer"
                :skybox-image="hdr"
                :src="src"
                auto-rotate
                camera-controls>
            </model-viewer>
        </div>
    </div>
</template>

<script>
import Test from '@/api/Test'
import { formDataReq } from '@/utils/common'
const STATIC_URL = 'http://localhost:1000'
export default {
    name: 'EditStudio',
    data() {
        return {
            STATIC_URL,
            sceneHeight: 0,
            sceneWidth: 0,
            hdr: null,
            // hdr: 'http://localhost:1000/test/467138984406167552/spruit_sunrise_1k_HDR.hdr',
            // src: 'http://192.168.1.3:1000/test/467051699627110400/ishikawa.gltf'
            // src: 'http://192.168.1.3:1000/test/467138984406167552/hat.gltf'
            src: 'http://192.168.1.3:1000/test/466685065607524352/monkey.gltf'
        }
    },
    created() {
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer()
    },
    mounted() {
        this.setSceneHeight()
        window.addEventListener('resize', this.setSceneHeight)
    },
    methods: {
        setSceneHeight() {
            const scene = document.getElementById('scene')
            if (scene) {
                this.sceneWidth = scene.offsetWidth
                this.sceneHeight = Math.ceil(scene.offsetWidth * 0.6)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.edit-studio {
    &-main {
        margin: 0 auto;
        width: 80%;
        padding-top: 20px;
        border-radius: 5px;
        overflow: hidden;
        background-color: #363940;
        model-viewer {
            width: 100%;
            height: 100%;
        }
        // @media (max-width: $split-width) {
        //     & {
        //         display: block;
        //     }
        //     &-left {
        //         width: 100%;
        //         .edit-option {
        //             width: 100%;
        //         }
        //     }
        // }
    }
}
</style>