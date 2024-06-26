<template>
    <div class="scene-pro">
        <Fold label="Sky Light" :visible="isSkyLightShow" @click="handleSkyLightFold">
            <div class="sky-light" v-show="isSkyLightShow">
                <div class="sky-light-top">
                    <EditBtn text="Image...">
                        <input class="sky-light-top-file" type="file" @change="handleImgChange">
                    </EditBtn>
                    <!-- <EditBtn text="Presets..."/> -->
                </div>
                <div class="sky-light-hdr"></div>
            </div>
        </Fold>
        <Fold label="Back drop" :visible="isBackDropShow" @click="handleBackDropFold">
            <div class="back-drop" v-show="isBackDropShow">
                <div class="back-drop-item">
                    <LabelSelectList 
                        label="Mode" 
                        :list="modeList" 
                        :current="skyBgMode" 
                        @change="handleBgModeChange">
                    </LabelSelectList>
                </div>
                <div class="back-drop-item">
                    <LabelSelectList 
                        label="Color Mode" 
                        :list="colorModeList" 
                        :current="skyBgColorMode" 
                        @change="handleBgColorModeChange">
                    </LabelSelectList>
                </div>
                <div class="back-drop-item back-drop-flexitem">
                    <ColorSelect 
                        v-if="skyBgColorMode === 'Simple'" 
                        :color="skyBgColor" 
                        @change="handleColorChange">
                    </ColorSelect>
                    <template v-else>
                        <ColorSelect label="Start Color" :color="gradientStartColor" @change="handleStartColorChange"/>
                        <ColorSelect label="End Color" :color="gradientEndColor" @change="handleEndColorChange"/>
                    </template>
                </div>
            </div>
        </Fold>
    </div>
</template>

<script>
import Fold from './Fold'
import EditBtn from './EditBtn'
import LabelSelectList from './LabelSelectList'
import ColorSelect from './ColorSelect'
import HDRImage from '@/utils/hdrpng'
import { mapGetters } from 'vuex'
export default {
    components: {
        Fold,
        EditBtn,
        LabelSelectList,
        ColorSelect
    },
    data() {
        return {
            hdr: null,
            isSkyLightShow: true,
            isBackDropShow: true,
            modeList: ['Color', 'Sky'],
            colorModeList: ['Simple', 'Gradient'],
        }
    },
    computed: {
        ...mapGetters(['exposure', 'gammaFactor', 'skyUrl', 'skyBgMode', 'skyBgColorMode', 'skyBgColor']),
        gradientStartColor() {
            if (this.skyBgColorMode === 'Gradient') {
                return this.skyBgColor.match(/(#[a-zA-Z0-9]{6})/g)[0]
            }
        },
        gradientEndColor() {
            if (this.skyBgColorMode === 'Gradient') {
                return this.skyBgColor.match(/(#[a-zA-Z0-9]{6})/g)[1]
            }
        },
    },
    mounted() {
        this.hdr = new HDRImage()
        setTimeout(() => {
            this.hdr.style.width = '100%'
            this.hdr.exposure = this.exposure
            this.hdr.gamma = this.gammaFactor
            if (this.skyUrl) this.hdr.src = this.skyUrl
            document.querySelector('.sky-light-hdr').appendChild(this.hdr)
        }, 100)
    },
    methods: {
        handleSkyLightFold(bool) {
            this.isSkyLightShow = bool
        },
        handleBackDropFold(bool) {
            this.isBackDropShow = bool
        },
        handleImgChange(e) {
            const file = e.target.files[0]
            this.$store.commit('setSkyByFile', file)
            this.hdr.src = this.skyUrl
        },
        handleBgModeChange(mode) {
            this.$store.commit('setSkyBgMode', mode)
        },
        handleBgColorModeChange(item) {
            this.$store.commit('setSkyBgColorMode', item)
        },
        handleColorChange(color) {
            this.$store.commit('setSkyColor', {pos: 'start', color})
        },
        handleStartColorChange(color) {
            this.$store.commit('setSkyColor', {pos: 'start', color})
        },
        handleEndColorChange(color) {
            this.$store.commit('setSkyColor', {pos: 'end', color})
        },
    },
}
</script>

<style lang="scss" scoped>
.scene-pro {
    .sky-light {
        padding: 5px;
        &-top {
            display: flex;
            justify-content: space-between;
            &-file {
                width: 70px;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                z-index: 2;
                opacity: 0;
                filter: opacity(0);
            }
        }
        &-hdr {
            margin-top: 5px;
            width: 100%;
            height: 110px;
            background-color: #2a2a2a;
            overflow: hidden;
            position: relative;
            canvas {
                width: 100%;
                height: 100%;
            }
        }
    }
    .back-drop {
        padding: 5px;
        &-item {
            padding: 5px 0;
        }
        &-flexitem {
            display: flex;
        }
    }
}
</style>