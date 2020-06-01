<template>
    <div class="edit-studio">
        <div class="edit-studio-main">
            <div 
                class="edit-studio-main-left" 
                :style="{height: sceneHeight + 'px'}">
                <div class="edit-option">
                    <h1>编辑器</h1>
                    <div class="edit-option-item">
                        <div class="edit-option-item-left">{{name.label}}</div>
                        <div class="edit-option-item-right">
                            <input class="edit-option-item-right-input" type="text" v-model="name.value" />
                        </div>
                    </div>
                    <div class="edit-option-item">
                        <div class="edit-option-item-left">{{description.label}}</div>
                        <div class="edit-option-item-right">
                            <textarea 
                                class="edit-option-item-right-textarea" 
                                rows="3" 
                                v-model="description.value">
                            </textarea>
                        </div>
                    </div>
                    <div class="edit-option-list">
                        <div class="edit-option-item">
                            <div class="edit-option-item-left">{{obj.label}}</div>
                            <div class="edit-option-item-right">
                                <div class="edit-option-item-right-label">
                                    <div class="eclipsis">{{obj.fileName}}</div>
                                </div>
                                <UploadFileItem 
                                    @change="handleObjChange">
                                </UploadFileItem>
                            </div>
                        </div>
                        <div class="edit-option-item">
                            <div class="edit-option-item-left">{{hdr.label}}</div>
                            <div class="edit-option-item-right">
                                <div class="edit-option-item-right-label">
                                    <div class="eclipsis">{{hdr.fileName}}</div>
                                </div>
                                <UploadFileItem 
                                    @change="handleHdrChange">
                                </UploadFileItem>
                            </div>
                        </div>
                        <div class="edit-option-item">
                            <div class="edit-option-item-left">{{exposure.label}}</div>
                            <div class="edit-option-item-right">
                                <div class="slider-item">
                                    <div class="slider-item-left">
                                        <Slider 
                                            showTip="never" 
                                            :max="10"
                                            :step="0.1"
                                            :disabled="!obj.url"
                                            v-model="exposure.value" 
                                            @on-input="handleExposureChange">
                                        </Slider>
                                    </div>
                                    <div class="slider-item-right">{{exposure.value}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="edit-option-item" v-for="(item, i) in mapList" :key="i">
                            <div class="edit-option-item-left">{{item.label}}</div>
                            <div class="edit-option-item-right">
                                <template v-if="item.class === 'map'">
                                    <div class="edit-option-item-right-label">
                                        <div class="eclipsis">{{item.fileName}}</div>
                                    </div>
                                    <UploadFileItem 
                                        :disabled="!obj.url" 
                                        @change="handleMapChange($event, i)">
                                    </UploadFileItem>
                                </template>
                                <template v-else-if="item.class === 'value'">
                                    <div class="slider-item">
                                        <div class="slider-item-left">
                                            <Slider 
                                                showTip="never" 
                                                :max="1"
                                                :step="0.01"
                                                :disabled="!obj.url"
                                                v-model="item.value" 
                                                @on-input="handleValueChange($event, item)">
                                            </Slider>
                                        </div>
                                        <div class="slider-item-right">{{item.value}}</div>
                                    </div>
                                </template>
                                <template v-else>
                                    <input 
                                        class="color-item" 
                                        type="color" 
                                        :disabled="!obj.url"
                                        v-model="item.value" 
                                        @change="handleColorChange($event, item)"/>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="edit-option-save">
                        <div class="edit-option-save-btn" @click="save">保存</div>
                    </div>
                </div>
            </div>
            <div 
                id="scene" 
                class="edit-studio-main-right" 
                :style="{height: sceneHeight + 'px'}">
            </div>
        </div>
    </div>
</template>

<script>
import Slider from '@/components/Slider'
import UploadFileItem from './UploadFileItem'
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
        Slider,
        UploadFileItem
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
    &-main {
        margin: 0 auto;
        width: 90%;
        display: flex;
        padding-top: 20px;
        &-left {
            width: 300px;
            .edit-option {
                width: 280px;
                height: 100%;
                border-radius: 5px;
                overflow: hidden;
                padding: 0 10px;
                background-color: #111111;
                h1 {
                    height: 50px;
                    line-height: 50px;
                    font-size: 16px;
                    text-align: center;
                    color: #888888;
                }
                &-list {
                    height: calc(100% - 232px);
                    overflow: auto;
                }
                &-save {
                    height: 50px;
                    padding: 10px 0 ;
                    &-btn {
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        color: #ffffff;
                        background-color: #555555;
                        border-radius: 2px;
                        font-size: 14px;
                        cursor: pointer;
                        &:hover {
                            background-color: #666666;
                        }
                    }
                }
                $item-height: 26px;
                &-item {
                    border-top: 1px dashed #666666;
                    padding: 10px 0;
                    font-size: 12px;
                    display: flex;
                    &-left {
                        width: 70px;
                        color: #888888;
                        height: $item-height;
                        line-height: $item-height;
                    }
                    &-right {
                        flex: 1;
                        display: flex;
                        &-label {
                            flex: 1;
                            width: 0;
                            height: $item-height;
                            line-height: $item-height;
                            padding-left: 10px;
                            padding-right: 10px;
                            color: #bbbbbb;
                            background-color: #333333;
                            border-top-left-radius: 2px;
                            border-bottom-left-radius: 2px;
                        }
                        &-btn {
                            $file-btn-color: #666666;
                            $file-btn-bg-color: #222222;
                            width: 70px;
                            height: $item-height;
                            line-height: $item-height;
                            text-align: center;
                            color: #666666;
                            background-color: $file-btn-bg-color;
                            border-top-right-radius: 2px;
                            border-bottom-right-radius: 2px;
                            position: relative;
                            &:hover {
                                color: lighten($file-btn-color, 5%);
                                background-color: lighten($file-btn-bg-color, 5%);
                            }
                            .file-upload {
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                z-index: 2;
                                width: 100%;
                                outline: none;
                                opacity: 0;
                                cursor: pointer;
                            }
                        }
                        &-input {
                            width: 100%;
                            height: $item-height;
                            line-height: $item-height;
                            color: #bbbbbb;
                            background-color: #333333;
                            border-radius: 2px;
                            border: none;
                            padding: 0 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            outline: none;
                            appearance: none;
                        }
                        &-textarea {
                            width: 100%;
                            line-height: 1.5;
                            color: #bbbbbb;
                            background-color: #333333;
                            border-radius: 2px;
                            border: none;
                            padding: 5px 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            outline: none;
                            appearance: none;
                        }
                        .slider-item {
                            width: 100%;
                            display: flex;
                            &-left {
                                flex: 1;
                            }
                            &-right {
                                width: 40px;
                                height: $item-height;
                                line-height: $item-height;
                                text-align: center;
                                color: #ffffff;
                            }
                        }
                        .color-item {
                            width: 60px;
                            height: $item-height;
                            border-radius: 2px;
                            outline: none;
                        }
                    }
                }
            }
        }
        &-right {
            flex: 1;
            border-radius: 5px;
            overflow: hidden;
            // background-color: #363940;
            background-image: linear-gradient(#4e535d, #363940);
        }
    }
}
</style>