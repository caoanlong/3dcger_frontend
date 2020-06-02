<template>
    <div class="camera-pro">
        <Fold label="Lens" :visible="isLensShow" @click="handleLensFold">
            <div class="lens" v-show="isLensShow">
                <SliderItem :value="fov" label="Field View (°)" :max="180" @change="handleFovChange"/>
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
            isLensShow: true
        }
    },
    computed: {
        ...mapGetters(['fov'])
    },
    methods: {
        handleLensFold(bool) {
            this.isLensShow = bool
        },
        handleFovChange(fov) {
            this.$store.commit('setFov', fov)
        }
    },
}
</script>

<style lang="scss" scoped>
.camera-pro {
    .lens {
        padding: 5px;
    }
}
</style>