<template>
    <div class="edit-studio">
        <div class="edit-studio-main" :style="{height: sceneHeight + 'px'}">
            <div class="edit-studio-main-left">
                <MainTools/>
            </div>
            <div id="scene" class="edit-studio-main-center">
            </div>
            <div class="edit-studio-main-right"></div>
        </div>
    </div>
</template>

<script>
import MainTools from './components/MainTools'
import Test from '@/api/Test'
import Scene from '@/api/Scene'
import { formDataReq } from '@/utils/common'
import EnvironmentScene from '@/utils/EnvironmentScene'
import '@/utils/OBJLoader'
import '@/utils/RGBELoader'
import '@/utils/OrbitControls'
import { name, description, obj, hdr, exposure, mapList } from './config'
const STATIC_URL = 'http://localhost:1000'
export default {
    name: 'EditStudio',
    components: {
        MainTools
    },
    data() {
        return {
            STATIC_URL,
            sceneHeight: 0,
            sceneWidth: 0,
            name: { ...name },
            description: { ...description },
            obj: { ...obj },
            hdr: { ...hdr },
            exposure: { ...exposure },
            mapList: mapList.map(item => ({ ...item })),
            scene: null,
            renderer: null,
            camera: null,
            pmremGenerator: null,
            group: null
        }
    },
    created() {
        window.addEventListener('resize', this.setSceneHeight, false)
    },
    mounted() {
        this.setSceneHeight()
        this.init()
    },
    methods: {
        init() {
            this.scene = new THREE.Scene()
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
            document.getElementById('scene').appendChild(this.renderer.domElement)
            this.camera = new THREE.PerspectiveCamera(45, this.sceneWidth / this.sceneHeight, 0.1, 1000)
            this.camera.position.set(0, 0, 5)
            this.renderer.setSize(this.sceneWidth, this.sceneHeight)
            this.renderer.setClearColor('#ffffff', 0)
            this.renderer.autoClear = true;
            this.renderer.toneMappingExposure = this.exposure.value
            this.renderer.gammaFactor = 2.2
            this.renderer.outputEncoding = THREE.GammaEncoding
            this.renderer.physicallyCorrectLights = true
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping
            this.renderer.shadowMap.enabled = true
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
            this.renderer.shadowMap.autoUpdate = false
            
            this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)

            const defaultScene = new EnvironmentScene()
            const defaultEnvTextture = this.pmremGenerator.fromScene(defaultScene, 0.04).texture
            this.scene.environment = defaultEnvTextture
            defaultScene.dispose()
            
            this.render()
            const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        },
        render() {
            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(this.render)
        },
        setSceneHeight() {
            const scene = document.getElementById('scene')
            if (scene) {
                this.sceneWidth = scene.offsetWidth
                this.sceneHeight = window.innerHeight - 150
            }
            if (this.camera) {
                this.camera.aspect = this.sceneWidth / this.sceneHeight
                this.camera.updateProjectionMatrix()
            }
            if (this.renderer) {
                this.renderer.setSize(this.sceneWidth, this.sceneHeight)
            }
        },
        /**
         * 重置参数
         */
        resetParams() {
            this.scene.children = []
            this.mapList = mapList.map(item => ({ ...item }))
        },
        getInitParams() {
            let metalness, roughness, aoMapIntensity
            for (let i = 0; i < this.mapList.length; i++) {
                const item = this.mapList[i]
                if (this.mapList[i].type === 'metalness') metalness = this.mapList[i].value
                if (this.mapList[i].type === 'roughness') roughness = this.mapList[i].value
                if (this.mapList[i].type === 'aoMapIntensity') aoMapIntensity = this.mapList[i].value
            }
            return { metalness, roughness, aoMapIntensity }
        },
        /**
         * 修改OBJ格式文件
         */
        handleObjChange(file) {
            this.resetParams()
            this.obj.file = file
            this.obj.fileName = file.name
            this.obj.url = window.URL.createObjectURL(file)
            const { metalness, roughness, aoMapIntensity } = this.getInitParams()
            const objLoader = new THREE.OBJLoader()
            objLoader.load(this.obj.url, (group) => {
                console.log(group)
                this.group = group
                this.group.children[0].material = new THREE.MeshStandardMaterial({
                    aoMapIntensity,
                    metalness,
                    roughness,
                    transparent: true
                })
                this.scene.add(this.group)
                // this.group.scale.set(1.3, 1.3, 1.3)
            })
        },
        /**
         * 修改HDR格式文件
         */
        handleHdrChange(file) {
            this.hdr.fileName = file.name
            this.hdr.url = window.URL.createObjectURL(file)
            const rgbeLoader = new THREE.RGBELoader().setDataType( THREE.UnsignedByteType )
            rgbeLoader.load(this.hdr.url, (hdrTexture, data) => {
                hdrTexture.encoding = THREE.RGBEEncoding
                hdrTexture.minFilter = THREE.NearestFilter
                hdrTexture.magFilter = THREE.NearestFilter
                hdrTexture.flipY = true
                
                const texture = this.pmremGenerator.fromEquirectangular(hdrTexture).texture
                this.scene.background = texture
                this.scene.environment = texture
            })
        },
        /**
         * 修改曝光度
         */
        handleExposureChange(value) {
            this.renderer.toneMappingExposure = value
        },
        /**
         * 修改贴图
         */
        handleMapChange(file, i) {
            this.mapList[i].file = file
            this.mapList[i].fileName = file.name
            this.mapList[i].url = window.URL.createObjectURL(file)
            new THREE.TextureLoader().load(this.mapList[i].url, (texture) => {
                // texture.encoding = THREE.sRGBEncoding
                texture.encoding = THREE.GammaEncoding
                this.group.children[0].material[this.mapList[i].type] = texture
                this.group.children[0].material.needsUpdate = true
            })
        },
        /**
         * 修改属性值
         */
        handleValueChange(value, data) {
            this.group.children[0].material[data.type] = value
            this.group.children[0].material.needsUpdate = true
        },
        /**
         * 修改颜色
         */
        handleColorChange(e, data) {
            console.log(e.target.value)
            this.group.children[0].material[data.type].set(e.target.value)
            this.group.children[0].material.needsUpdate = true
        },

        save() {
            const data = formDataReq({
                name: this.name.value,
                description: this.description.value,
                hdr: this.hdr.file,
                exposure: this.exposure.value,
                obj: this.obj.file,
                metalness: this.mapList[0].value,
                metalnessMap: this.mapList[1].file,
                roughness: this.mapList[2].value,
                roughnessMap: this.mapList[3].file,
                color: this.mapList[4].value,
                map: this.mapList[5].file,
                emissive: this.mapList[6].value,
                emissiveIntensity: this.mapList[7].value,
                emissiveMap: this.mapList[8].file,
                aoMapIntensity: this.mapList[9].value,
                aoMap: this.mapList[10].file,
                normalMap: this.mapList[11].file,
                bumpMap: this.mapList[12].file,
                displacementMap: this.mapList[13].file,
                opacity: this.mapList[14].value,
                alphaMap: this.mapList[15].file,
                refractionRatio: this.mapList[16].value
            })
            Scene.save(data).then(res => {
                console.log(res)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.edit-studio {
    padding-top: 20px;
    &-main {
        margin: 0 auto;
        width: 90%;
        display: flex;
        box-shadow: 0 5px 8px rgba(0, 0, 0, .2);
        &-left {
            width: 240px;
            height: 100%;
            overflow: hidden;
            background-color: #343434;
        }
        &-right {
            width: 240px;
            height: 100%;
            overflow: hidden;
            background-color: #343434;
        }
        &-center {
            flex: 1;
            overflow: hidden;
            background-image: linear-gradient(#b7bdc8, #a5a9b4);
        }
    }
}
</style>