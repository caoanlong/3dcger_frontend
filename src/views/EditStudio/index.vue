<template>
    <div class="edit-studio">
        <div class="edit-studio-main">
            <div class="edit-studio-main-left">
                <div class="edit-option">
                    <h1>编辑器</h1>
                    <div 
                        class="edit-option-item" 
                        v-for="(item, i) in editOptions" 
                        :key="i">
                        <div class="edit-option-item-top">
                            <div class="edit-option-item-top-label">{{item.type}}</div>
                            <div class="edit-option-item-top-btn">选择文件</div>
                        </div>
                        <div class="edit-option-item-bottom">{{item.fileName}}</div>
                    </div>
                </div>
            </div>
            <div 
                id="scene" 
                class="edit-studio-main-right" 
                :style="{height: sceneHeight + 'px'}">
                <model-viewer
                    id="modelViewer"
                    skybox-image="http://image.exposures.xyz/spruit_sunrise_1k_HDR.hdr"
                    src="http://image.exposures.xyz/DamagedHelmet.gltf"
                    auto-rotate
                    camera-controls>
                </model-viewer>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EditStudio',
    data() {
        return {
            sceneHeight: 0,
            editOptions: [
                {
                    type: 'OBJ',
                    fileName: 'default.obj'
                },{
                    type: 'COLOR 贴图',
                    fileName: 'default_color.jpg'
                },{
                    type: 'NORMAL 贴图',
                    fileName: 'default_normaldefault_normaldefault_normal.jpg'
                },{
                    type: 'AO 贴图',
                    fileName: 'default_ao.jpg'
                },
            ]
        }
    },
    mounted() {
        window.addEventListener('resize', this.setSceneHeight)
        this.setSceneHeight()
        const modelViewer = document.getElementById('modelViewer')
        console.log(modelViewer.pause)
    },
    methods: {
        setSceneHeight() {
            const scene = document.getElementById('scene')
            if (scene) {
                this.sceneHeight = Math.ceil(scene.offsetWidth * 0.7)
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
                            flex: 0 0 80px;
                            text-align: center;
                            color: #666666;
                            background-color: $file-btn-bg-color;
                            border-radius: 2px;
                            cursor: pointer;
                            &:hover {
                                color: lighten($file-btn-color, 5%);
                                background-color: lighten($file-btn-bg-color, 5%);
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