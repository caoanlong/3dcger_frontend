<template>
    <div class="material">
        <div class="material-ctx" :id="'ctx' + index"></div>
        <div class="material-name">{{material.material.type.replace(/mesh/ig, '')}}</div>
    </div>
</template>

<script>
import EnvironmentScene from '@/utils/EnvironmentScene'
import { mapGetters } from 'vuex'
export default {
    props: {
        material: Object,
        index: Number
    },
    computed: {
        ...mapGetters(['skyTexture', 'exposure', 'gammaFactor'])
    },
    mounted() {
        const scene = new THREE.Scene()
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
        camera.position.set(0, 0, 5)

        renderer.setSize(107, 107)
        renderer.setClearColor('#ffffff', 0)
        renderer.autoClear = true
        renderer.toneMappingExposure = this.exposure
        renderer.gammaFactor = this.gammaFactor
        renderer.outputEncoding = THREE.GammaEncoding
        renderer.physicallyCorrectLights = true
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.toneMapping = THREE.ACESFilmicToneMapping

        document.getElementById('ctx' + this.index).appendChild(renderer.domElement)

        const geometry = new THREE.SphereGeometry(1.5, 32, 32)
        const sphere = new THREE.Mesh( geometry, this.material.material )
        scene.add(sphere)

        const pmremGenerator = new THREE.PMREMGenerator(renderer)
        const defaultScene = new EnvironmentScene()
        const defaultEnvTextture = pmremGenerator.fromScene(defaultScene, 0.04).texture
        scene.environment = defaultEnvTextture
        defaultScene.dispose()

        this.material.emitRender = this.material.onRender(renderer, scene, camera)
    }
}
</script>

<style lang="scss" scoped>
.material {
    width: 107px;
    &-ctx {
        width: 107px;
        height: 107px;
        background-color: #2c2c2c;
    }
    &-name {
        height: 20px;
        height: 20px;
        line-height: 20px;
        padding: 0 2px;
        font-size: 12px;
        color: #cbcbcb;
        overflow: hidden;
        background-color: #4d4d4d;
    }
}
</style>