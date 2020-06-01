<template>
    <div class="edit-studio">
        <div class="edit-studio-main">
            <div class="edit-studio-main-left">
                <div class="edit-option">
                    <h1>编辑器</h1>
                    <div class="edit-option-item">
                        <div class="edit-option-item-top">
                            <div class="edit-option-item-top-label">{{name.label}}</div>
                        </div>
                        <input class="edit-option-item-input" type="text" v-model="name.value" />
                    </div>
                    <div class="edit-option-item">
                        <div class="edit-option-item-top">
                            <div class="edit-option-item-top-label">{{description.label}}</div>
                        </div>
                        <textarea 
                            class="edit-option-item-textarea" 
                            rows="3" 
                            v-model="description.value">
                        </textarea>
                    </div>
                    <!-- OBJ -->
                    <div class="edit-option-item">
                        <div class="edit-option-item-top">
                            <div class="edit-option-item-top-label">{{obj.label}}</div>
                            <div class="edit-option-item-top-btn">
                                <span>选择文件</span>
                                <input 
                                    class="file-upload" 
                                    type="file" 
                                    name="obj" 
                                    @change="handleObjChange"/>
                            </div>
                        </div>
                        <div class="edit-option-item-bottom">{{obj.fileName}}</div>
                    </div>
                    <div class="edit-option-item">
                        <div class="edit-option-item-top">
                            <div class="edit-option-item-top-label">{{colorMap.label}}</div>
                            <div class="edit-option-item-top-btn">
                                <span>选择文件</span>
                                <input 
                                    class="file-upload" 
                                    type="file" 
                                    name="colorMap" 
                                    :disabled="!obj.src"
                                    :style="{cursor: !!obj.src ? 'pointer' : 'not-allowed'}"
                                    @change="handleMapChange($event, 'colorMap')"/>
                            </div>
                        </div>
                        <div class="edit-option-item-bottom">{{colorMap.fileName}}</div>
                    </div>
                    <div class="edit-option-item">
                        <div class="edit-option-item-top">
                            <div class="edit-option-item-top-label">{{normalMap.label}}</div>
                            <div class="edit-option-item-top-btn">
                                <span>选择文件</span>
                                <input 
                                    class="file-upload" 
                                    type="file" 
                                    name="normalMap" 
                                    :disabled="!obj.src"
                                    :style="{cursor: !!obj.src ? 'pointer' : 'not-allowed'}"
                                    @change="handleMapChange($event, 'normalMap')"/>
                            </div>
                        </div>
                        <div class="edit-option-item-bottom">{{normalMap.fileName}}</div>
                    </div>
                    <div class="edit-option-item">
                        <div class="edit-option-item-top">
                            <div class="edit-option-item-top-label">{{aoMap.label}}</div>
                            <div class="edit-option-item-top-btn">
                                <span>选择文件</span>
                                <input 
                                    class="file-upload" 
                                    type="file" 
                                    name="aoMap" 
                                    :disabled="!obj.src"
                                    :style="{cursor: !!obj.src ? 'pointer' : 'not-allowed'}"
                                    @change="handleMapChange($event, 'aoMap')"/>
                            </div>
                        </div>
                        <div class="edit-option-item-bottom">{{aoMap.fileName}}</div>
                    </div>
                </div>
            </div>
            <div 
                id="scene" 
                class="edit-studio-main-right" 
                :style="{height: sceneHeight + 'px'}">
                <!-- <model-viewer
                    id="modelViewer"
                    skybox-image="http://image.exposures.xyz/spruit_sunrise_1k_HDR.hdr"
                    src="http://image.exposures.xyz/DamagedHelmet.gltf"
                    auto-rotate
                    camera-controls>
                </model-viewer> -->
            </div>
        </div>
    </div>
</template>

<script>
import Test from '@/api/Test'
import { formDataReq } from '@/utils/common'
import '@/utils/OBJLoader'
import '@/utils/EXRLoader'
import '@/utils/OrbitControls'
const STATIC_URL = 'http://localhost:1000'
export default {
    name: 'EditStudio',
    data() {
        return {
            STATIC_URL,
            sceneHeight: 0,
            sceneWidth: 0,
            name: {
                label: '名称',
                value: ''
            },
            description: {
                label: '描述',
                value: ''
            },
            obj: {
                label: 'OBJ',
                fileName: '',
                src: '',
                file: ''
            },
            colorMap: {
                label: 'COLOR',
                fileName: '',
                src: '',
                file: ''
            },
            normalMap: {
                label: 'NORMAL',
                fileName: '',
                src: '',
                file: ''
            },
            aoMap: {
                label: 'AO',
                fileName: '',
                src: '',
                file: ''
            },
            scene: null,
            renderer: null,
            camera: null,
            pngCubeRenderTarget: null
        }
    },
    created() {
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer()
    },
    mounted() {
        this.setSceneHeight()
        window.addEventListener('resize', this.setSceneHeight)
        
        this.camera = new THREE.PerspectiveCamera(75, this.sceneWidth / this.sceneHeight, 0.1, 1000)
        this.renderer.setSize(this.sceneWidth, this.sceneHeight)
        //设置背景颜色
        // this.renderer.setClearColor('#333333', 1)
        //body元素中插入canvas对象
        document.getElementById('scene').appendChild(this.renderer.domElement)

        const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        pmremGenerator.compileEquirectangularShader()
        
        THREE.DefaultLoadingManager.onLoad = function ( ) {
            pmremGenerator.dispose()
        }

        new THREE.TextureLoader().load('/equirectangular.png', texture => {
            texture.encoding = THREE.sRGBEncoding
            this.pngCubeRenderTarget = pmremGenerator.fromEquirectangular(texture)
            const background = this.pngCubeRenderTarget.texture
            this.scene.background = background
            texture.dispose()
        })

        // this.renderer.toneMappingExposure = 1.0
        
        const loader = new THREE.OBJLoader()
        // 没有材质文件，系统自动设置Phong网格材质
        loader.load('/monkey/monkey.obj', (obj) => {
            // 控制台查看返回结构：包含一个网格模型Mesh的组Group
            // console.log(obj)
            // 查看加载器生成的材质对象：MeshPhongMaterial
            console.log(obj.children[0].material)

            const map = new THREE.TextureLoader().load('/monkey/albedo.png')
            const normalMap = new THREE.TextureLoader().load('/monkey/normal.png')
            const aoMap = new THREE.TextureLoader().load('/monkey/ao.png')
            const metalnessMap = new THREE.TextureLoader().load('/monkey/metallic.png')
            const roughnessMap = new THREE.TextureLoader().load('/monkey/roughness.png')
            obj.children[0].material = new THREE.MeshStandardMaterial({
                map,
                normalMap,
                aoMap,
                metalnessMap,
                roughnessMap,
                envMapIntensity: 1.0
            })
            obj.children[0].material.envMap = this.pngCubeRenderTarget.texture
            obj.children[0].material.needsUpdate = true
            console.log(obj.children[0].material)
            this.scene.add(obj)
            obj.children[0].scale.set(2, 2, 2)
        })

        //设置相机位置
        this.camera.position.set(0, 0, 5)
        //执行渲染操作   指定场景、相机作为参数
        this.render()
        const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        //监听鼠标、键盘事件
        controls.addEventListener('change', this.render)
        // this.animate()
    },
    methods: {
        setSceneHeight() {
            const scene = document.getElementById('scene')
            if (scene) {
                this.sceneWidth = scene.offsetWidth
                this.sceneHeight = Math.ceil(scene.offsetWidth * 0.7)
            }
        },
        render() {
            this.renderer.render(this.scene, this.camera)
        },
        animate() {
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
        },
        handleObjChange(e) {
            const file = e.target.files[0]
            const url = window.URL.createObjectURL(file)
            this.obj.fileName = file.name
            const data = formDataReq({ obj: file })
            Test.add(data).then(res => {
                setTimeout(() => {
                    this.obj.src = res.data.data
                }, 2000)
            })
        },
        handleMapChange(e, type) {
            const file = e.target.files[0]
            this[type].fileName = file.name
            this[type].src = file.url
        },
        handleFileChange(e, i) {
            // const file = e.target.files[0]
            // const url = window.URL.createObjectURL(file)
            // this.editOptions[i].fileName = file.name
            // this.editOptions[i].src = url
            // console.log(file.name)
            // console.log(url)
            // return
            // const reader = new FileReader()
            // reader.onload = (ev) => {
            //     const result = ev.target.result
            //     console.log(JSON.parse(result))
            // }
            // reader.readAsText(file)
        }
    },
}
</script>

<style lang="scss" scoped>
.edit-studio {
    &-main {
        margin: 0 auto;
        width: 80%;
        display: flex;
        padding-top: 20px;
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
        &-left {
            width: 240px;
            .edit-option {
                width: 220px;
                border-radius: 5px;
                overflow: hidden;
                padding: 0 10px;
                background-color: #111111;
                h1 {
                    height: 60px;
                    line-height: 60px;
                    font-size: 18px;
                    text-align: center;
                    color: #888888;
                }
                &-item {
                    border-top: 1px dashed #666666;
                    padding: 15px 0;
                    &-top {
                        display: flex;
                        height: 30px;
                        line-height: 30px;
                        &-label {
                            flex: 1;
                            color: #888888;
                        }
                        &-btn {
                            $file-btn-color: #666666;
                            $file-btn-bg-color: #222222;
                            width: 80px;
                            text-align: center;
                            color: #666666;
                            background-color: $file-btn-bg-color;
                            border-radius: 2px;
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
                    }
                    &-bottom {
                        margin-top: 5px;
                        height: 30px;
                        line-height: 30px;
                        color: #bbbbbb;
                        background-color: #333333;
                        border-radius: 2px;
                        padding: 0 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    &-input {
                        width: 180px;
                        margin-top: 5px;
                        height: 30px;
                        line-height: 30px;
                        color: #bbbbbb;
                        font-size: 16px;
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
                        width: 180px;
                        margin-top: 5px;
                        line-height: 1.5;
                        color: #bbbbbb;
                        font-size: 16px;
                        background-color: #333333;
                        border-radius: 2px;
                        border: none;
                        padding: 5px 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        outline: none;
                        appearance: none;
                    }
                }
            }
        }
        &-right {
            flex: 1;
            border-radius: 5px;
            overflow: hidden;
            background-color: #363940;
            model-viewer {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>