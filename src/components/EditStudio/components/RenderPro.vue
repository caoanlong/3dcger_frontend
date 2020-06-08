<template>
    <div class="render-pro">
        <Fold label="Renderer" :visible="isRendererShow" @click="handleRendererFold">
            <div class="renderer" v-show="isRendererShow">
                <SliderItem :value="exposure" label="Exposure" @change="handleExposureChange"/>
                <SliderItem :value="gammaFactor" label="GammaFactor" @change="handleGammaFactorChange"/>
            </div>
        </Fold>
    </div>
</template>

<script>
import Fold from './Fold'
import SliderItem from './SliderItem'
import { mapGetters } from 'vuex'
export default {
    components: {
        Fold,
        SliderItem
    },
    data() {
        return {
            isRendererShow: true,
        }
    },
    computed: {
        ...mapGetters(['exposure', 'gammaFactor']),
    },
    methods: {
        handleRendererFold(bool) {
            this.isRendererShow = bool
        },
        handleExposureChange(val) {
            this.$store.commit('setExposure', val)
        },
        handleGammaFactorChange(val) {
            this.$store.commit('setGammaFactor', val)
        }
    }
}
</script>

<style lang="scss" scoped>
.render-pro {
    .renderer {
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