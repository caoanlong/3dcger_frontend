<template>
    <div class="material" :style="`width:${SIZE}px;height:${SIZE+20}px`" @click="handleSelect">
        <div class="material-ctx" :id="'ctx' + material.uuid" :style="`width:${SIZE}px;height:${SIZE}px`"></div>
        <div class="material-name eclipsis">{{material.material.type.replace(/mesh|material/ig, '')}}</div>
        <div class="material-top" v-if="isActive"></div>
        <div class="material-bottom" v-if="isActive"></div>
    </div>
</template>

<script>
import THREE from '@/utils/three.module'
import EnvironmentScene from '@/utils/EnvironmentScene'
import { mapGetters } from 'vuex'
const SIZE = 70
export default {
    props: {
        material: Object,
        isActive: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            SIZE
        }
    },
    computed: {
        ...mapGetters(['skyTexture', 'exposure', 'gammaFactor'])
    },
    mounted() {
        const scene = new THREE.Scene()
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
        camera.position.set(0, 0, 5)

        renderer.setSize(SIZE, SIZE)
        renderer.setClearColor('#ffffff', 0)
        renderer.autoClear = true
        renderer.toneMappingExposure = this.exposure
        renderer.gammaFactor = this.gammaFactor
        renderer.outputEncoding = THREE.GammaEncoding
        renderer.physicallyCorrectLights = true
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.toneMapping = THREE.ACESFilmicToneMapping

        document.getElementById('ctx' + this.material.uuid).appendChild(renderer.domElement)

        const geometry = new THREE.SphereGeometry(1.5, 32, 32)
        const sphere = new THREE.Mesh( geometry, this.material.material )
        scene.add(sphere)

        const pmremGenerator = new THREE.PMREMGenerator(renderer)
        const defaultScene = new EnvironmentScene()
        const defaultEnvTextture = pmremGenerator.fromScene(defaultScene, 0.04).texture
        scene.environment = defaultEnvTextture
        defaultScene.dispose()

        this.material.emitRender = this.material.onRender(renderer, scene, camera)
    },
    methods: {
        handleSelect() {
            this.$store.commit('setCurrentMaterial', this.material)
        }
    },
}
</script>

<style lang="scss" scoped>
.material {
    position: relative;
    &-ctx {
        background-color: #2c2c2c;
    }
    &-name {
        height: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        padding: 0 2px;
        font-size: 12px;
        color: #cbcbcb;
        overflow: hidden;
        background-color: #4d4d4d;
    }
    &-top {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 2px;
        background-color: $primary-color;
    }
    &-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 2px;
        background-color: $primary-color;
    }
}
</style>