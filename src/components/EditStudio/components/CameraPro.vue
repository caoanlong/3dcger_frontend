<template>
    <div class="camera-pro">
        <Fold label="Lens" :visible="isLensShow" @click="handleLensFold">
            <div class="lens" v-show="isLensShow">
                <SliderItemAsync :value="fov" label="Field View (°)" :max="180" @change="handleFovChange"/>
                <SliderItemAsync :value="near" label="Near" :max="10" @change="handleNearChange"/>
                <SliderItemAsync :value="far" label="Far" :max="10000" @change="handleFarChange"/>
            </div>
        </Fold>
    </div>
</template>

<script>
import Fold from './Fold'
import SliderItemAsync from './SliderItemAsync'
import { mapGetters } from 'vuex'
export default {
    components: {
        Fold,
        SliderItemAsync
    },
    data() {
        return {
            isLensShow: true
        }
    },
    computed: {
        ...mapGetters(['fov', 'near', 'far'])
    },
    methods: {
        handleLensFold(bool) {
            this.isLensShow = bool
        },
        handleFovChange(fov) {
            this.$store.commit('setFov', fov)
        },
        handleNearChange(near) {
            this.$store.commit('setNear', near)
        },
        handleFarChange(far) {
            this.$store.commit('setFar', far)
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