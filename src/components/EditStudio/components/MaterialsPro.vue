<template>
    <div class="materials-pro" :style="{height: height + 'px'}">
        <template v-if="currentMaterial">
            <Fold label="Type" :visible="isTypeShow" @click="handleTypeFold">
                <div class="type" v-show="isTypeShow">
                    <LabelSelectList 
                        label="Material Type" 
                        :list="['physical', 'refraction']" 
                        :current="currentMaterial.mtlType" 
                        @change="handleTypeChange">
                    </LabelSelectList>
                </div>
            </Fold>
            <Fold label="Color" :visible="isColorShow" @click="handleColorFold">
                <div class="color" v-show="isColorShow">
                    <TextureUnit 
                        label="Color Map"
                        :mapName="currentMaterial.colorMapName"
                        :mapUrl="currentMaterial.colorMapUrl"
                        @img-change="handleColorMapChange">
                    </TextureUnit>
                    <ColorSelect 
                        style="margin-top: 5px"
                        :color="currentMaterial.material.color && currentMaterial.material.color.getHexString()" 
                        @change="handleColorChange">
                    </ColorSelect>
                </div>
            </Fold>
            <Fold label="Metalness" :visible="isMetalnessShow" @click="handleMetalnessFold">
                <div class="metalness" v-show="isMetalnessShow">
                    <TextureUnit 
                        label="Metalness Map" 
                        :mapName="currentMaterial.metalnessMapName" 
                        :mapUrl="currentMaterial.metalnessMapUrl" 
                        @img-change="handleMetalnessMapChange">
                    </TextureUnit>
                    <SliderItem 
                        :value="currentMaterial.material.metalness" 
                        label="Metalness" 
                        :max="1"
                        @change="handleMetalnessChange">
                    </SliderItem>
                </div>
            </Fold>
            <Fold label="Roughness" :visible="isRoughnessShow" @click="handleRoughnessFold">
                <div class="roughness" v-show="isRoughnessShow">
                    <TextureUnit 
                        label="Roughness Map" 
                        :mapName="currentMaterial.roughnessMapName" 
                        :mapUrl="currentMaterial.roughnessMapUrl" 
                        @img-change="handleRoughnessMapChange">
                    </TextureUnit>
                    <SliderItem 
                        :value="currentMaterial.material.roughness" 
                        label="Roughness" 
                        :max="1"
                        @change="handleRoughnessChange">
                    </SliderItem>
                </div>
            </Fold>
            <Fold label="Normal" :visible="isNormalShow" @click="handleNormalFold">
                <div class="normal" v-show="isNormalShow">
                    <TextureUnit 
                        label="Normal Map" 
                        :mapName="currentMaterial.normalMapName" 
                        :mapUrl="currentMaterial.normalMapUrl" 
                        @img-change="handleNormalMapChange">
                    </TextureUnit>
                </div>
            </Fold>
            <Fold label="Ao" :visible="isAoShow" @click="handleAoFold">
                <div class="ao" v-show="isAoShow">
                    <TextureUnit 
                        label="Ao Map" 
                        :mapName="currentMaterial.aoMapName" 
                        :mapUrl="currentMaterial.aoMapUrl" 
                        @img-change="handleAoMapChange">
                    </TextureUnit>
                    <SliderItem 
                        :value="currentMaterial.material.aoMapIntensity" 
                        label="aoMapIntensity" 
                        :max="1"
                        @change="handleAoMapIntensityChange">
                    </SliderItem>
                </div>
            </Fold>
            <Fold label="Emissive" :visible="isEmissiveShow" @click="handleEmissiveFold">
                <div class="emissive" v-show="isEmissiveShow">
                    <TextureUnit 
                        label="Emissive Map" 
                        :mapName="currentMaterial.emissiveMapName" 
                        :mapUrl="currentMaterial.emissiveMapUrl" 
                        @img-change="handleEmissiveMapChange">
                    </TextureUnit>
                    <ColorSelect 
                        style="margin-top: 5px"
                        :color="currentMaterial.material.emissive && currentMaterial.material.emissive.getHexString()" 
                        @change="handleEmissiveChange">
                    </ColorSelect>
                    <SliderItem 
                        :value="currentMaterial.material.emissiveIntensity" 
                        label="emissiveIntensity" 
                        :max="1"
                        @change="handleEmissiveIntensityChange">
                    </SliderItem>
                </div>
            </Fold>
            <Fold label="Transparency" :visible="isTransparencyShow" @click="handleTransparencyFold">
                <div class="transparency" v-show="isTransparencyShow">
                    <SliderItem 
                        :value="currentMaterial.material.transparency" 
                        label="Transparency" 
                        :max="1"
                        @change="handleTransparencyChange">
                    </SliderItem>
                </div>
            </Fold>
            <Fold label="Reflectivity" :visible="isReflectivityShow" @click="handleReflectivityFold">
                <div class="reflectivity" v-show="isReflectivityShow">
                    <SliderItem 
                        :value="currentMaterial.material.reflectivity" 
                        label="Reflectivity" 
                        :max="1"
                        @change="handleReflectivityChange">
                    </SliderItem>
                </div>
            </Fold>
        </template>
        <NoSelection v-else/>
    </div>
</template>
<script>
import NoSelection from './NoSelection'
import Fold from './Fold'
import SliderItem from './SliderItem'
import TextureUnit from './TextureUnit'
import ColorSelect from './ColorSelect'
import LabelSelectList from './LabelSelectList'
import { mapGetters } from 'vuex'
import { setMap, getFileSuffixByName, createMaterial } from '@/utils/common'
export default {
    components: {
        NoSelection,
        Fold,
        SliderItem,
        TextureUnit,
        ColorSelect,
        LabelSelectList
    },
    props: {
        height: {
            type: Number,
            default: 350
        }
    },
    data() {
        return {
            isTypeShow: true,
            isColorShow: true,
            isMetalnessShow: true,
            isRoughnessShow: true,
            isNormalShow: true,
            isAoShow: true,
            isEmissiveShow: true,
            isTransparencyShow: true,
            isReflectivityShow: true
        }
    },
    computed: {
        ...mapGetters(['materials', 'currentMaterial'])
    },
    methods: {
        handleTypeFold(bool) {
            this.isTypeShow = bool
        },
        handleColorFold(bool) {
            this.isColorShow = bool
        },
        handleMetalnessFold(bool) {
            this.isMetalnessShow = bool
        },
        handleRoughnessFold(bool) {
            this.isRoughnessShow = bool
        },
        handleNormalFold(bool) {
            this.isNormalShow = bool
        },
        handleAoFold(bool) {
            this.isAoShow = bool
        },
        handleEmissiveFold(bool) {
            this.isEmissiveShow = bool
        },
        handleTransparencyFold(bool) {
            this.isTransparencyShow = bool
        },
        handleReflectivityFold(bool) {
            this.isReflectivityShow = bool
        },
        handleTypeChange(type) {
            this.currentMaterial.mtlType = type
            const geoName = this.currentMaterial.material.geoName
            const mtl = createMaterial(type)
            mtl.geoName = geoName
            this.$set(this.currentMaterial, 'material', mtl)
            this.$set(this.currentMaterial.obj, 'material', mtl)
            // this.currentMaterial.material = mtl
            // this.currentMaterial.obj.material = mtl
        },
        handleColorChange(color) {
            this.currentMaterial.material.color.set(color)
        },
        handleColorMapChange(file) {
            if (file) {
                this.currentMaterial.colorMapFile = file
                this.currentMaterial.colorMapName = file.name
                this.currentMaterial.colorMapUrl = window.URL.createObjectURL(file)
                setMap(this.currentMaterial.colorMapUrl, this.currentMaterial, 'map', getFileSuffixByName(file.name))
            } else {
                this.currentMaterial.colorMapFile = null
                this.currentMaterial.colorMapName = ''
                this.currentMaterial.colorMapUrl = ''
                this.currentMaterial.material.map = null
                this.currentMaterial.material.needsUpdate = true
            }
        },
        handleMetalnessChange(value) {
            this.currentMaterial.material.metalness = value
        },
        handleMetalnessMapChange(file) {
            if (file) {
                this.currentMaterial.metalnessMapFile = file
                this.currentMaterial.metalnessMapName = file.name
                this.currentMaterial.metalnessMapUrl = window.URL.createObjectURL(file)
                setMap(this.currentMaterial.metalnessMapUrl, this.currentMaterial, 'metalnessMap', getFileSuffixByName(file.name))
            } else {
                this.currentMaterial.metalnessMapFile = null
                this.currentMaterial.metalnessMapName = ''
                this.currentMaterial.metalnessMapUrl = ''
                this.currentMaterial.material.metalnessMap = null
                this.currentMaterial.material.needsUpdate = true
            }
        },
        handleRoughnessChange(value) {
            this.currentMaterial.material.roughness = value
        },
        handleRoughnessMapChange(file) {
            if (file) {
                this.currentMaterial.roughnessMapFile = file
                this.currentMaterial.roughnessMapName = file.name
                this.currentMaterial.roughnessMapUrl = window.URL.createObjectURL(file)
                setMap(this.currentMaterial.roughnessMapUrl, this.currentMaterial, 'roughnessMap', getFileSuffixByName(file.name))
            } else {
                this.currentMaterial.roughnessMapFile = null
                this.currentMaterial.roughnessMapName = ''
                this.currentMaterial.roughnessMapUrl = ''
                this.currentMaterial.material.roughnessMap = null
                this.currentMaterial.material.needsUpdate = true
            }
        },
        handleNormalMapChange(file) {
            if (file) {
                this.currentMaterial.normalMapFile = file
                this.currentMaterial.normalMapName = file.name
                this.currentMaterial.normalMapUrl = window.URL.createObjectURL(file)
                setMap(this.currentMaterial.normalMapUrl, this.currentMaterial, 'normalMap', getFileSuffixByName(file.name))
            } else {
                this.currentMaterial.normalMapFile = null
                this.currentMaterial.normalMapName = ''
                this.currentMaterial.normalMapUrl = ''
                this.currentMaterial.material.normalMap = null
                this.currentMaterial.material.needsUpdate = true
            }
        },
        handleAoMapChange(file) {
            if (file) {
                this.currentMaterial.aoMapFile = file
                this.currentMaterial.aoMapName = file.name
                this.currentMaterial.aoMapUrl = window.URL.createObjectURL(file)
                setMap(this.currentMaterial.aoMapUrl, this.currentMaterial, 'aoMap', getFileSuffixByName(file.name))
            } else {
                this.currentMaterial.aoMapFile = null
                this.currentMaterial.aoMapName = ''
                this.currentMaterial.aoMapUrl = ''
                this.currentMaterial.material.aoMap = null
                this.currentMaterial.material.needsUpdate = true
            }
        },
        handleAoMapIntensityChange(value) {
            this.currentMaterial.material.aoMapIntensity = value
        },
        handleEmissiveMapChange(file) {
            if (file) {
                this.currentMaterial.emissiveMapFile = file
                this.currentMaterial.emissiveMapName = file.name
                this.currentMaterial.emissiveMapUrl = window.URL.createObjectURL(file)
                setMap(this.currentMaterial.emissiveMapUrl, this.currentMaterial, 'emissiveMap', getFileSuffixByName(file.name))
            } else {
                this.currentMaterial.emissiveMapFile = null
                this.currentMaterial.emissiveMapName = ''
                this.currentMaterial.emissiveMapUrl = ''
                this.currentMaterial.material.emissiveMap = null
                this.currentMaterial.material.needsUpdate = true
            }
        },
        handleEmissiveChange(color) {
            this.currentMaterial.material.emissive.set(color)
        },
        handleEmissiveIntensityChange(value) {
            this.currentMaterial.material.emissiveIntensity = value
        },
        handleTransparencyChange(value) {
            this.currentMaterial.material.transparency = value
        },
        handleReflectivityChange(value) {
            this.currentMaterial.material.reflectivity = value
        }
    },
}
</script>
<style lang="scss" scoped>
.materials-pro {
    overflow: auto;
    border: 1px solid #262626;
    background-color: #383838;
    .type {
        padding: 10px 5px;
    }
    .color {
        padding: 5px;
    }
    .metalness {
        padding: 5px;
    }
    .roughness {
        padding: 5px;
    }
    .normal {
        padding: 5px;
    }
    .ao {
        padding: 5px;
    }
    .emissive {
        padding: 5px;
    }
    .transparency {
        padding: 5px;
    }
}
</style>