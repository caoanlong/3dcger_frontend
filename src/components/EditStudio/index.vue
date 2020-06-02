<template>
    <div class="edit-studio" :style="{height: height + 'px'}">
        <EditLeftBlock class="edit-studio-left" :height="height"/>
        <div 
            id="view" 
            class="edit-studio-center" 
            :style="`background:${skyBgColor}`">
        </div>
        <EditRightBlock class="edit-studio-right" :height="height"/>
    </div>
</template>

<script>
import EditLeftBlock from './EditLeftBlock'
import EditRightBlock from './EditRightBlock'
import { mapGetters } from 'vuex'
import '@/utils/OrbitControls'
export default {
    components: {
        EditLeftBlock,
        EditRightBlock
    },
    data() {
        return {
            height: 0,
            width: 0,
        }
    },
    computed: {
        ...mapGetters(['scene', 'renderer', 'camera', 'skyBgColor', 'materials'])
    },
    created() {
        window.addEventListener('resize', this.resizeWin, false)
    },
    mounted() {
        this.resizeWin()
        this.$store.commit('init', {
            el: document.getElementById('view'),
            width: this.width,
            height: this.height,
        })
        this.render()
        new THREE.OrbitControls(this.camera, this.renderer.domElement)
    },
    methods: {
        resizeWin() {
            const view = document.getElementById('view')
            if (view) {
                this.width = view.offsetWidth
                this.height = window.innerHeight - 100
            }
            if (this.camera) {
                this.camera.aspect = this.width / this.height
                this.camera.updateProjectionMatrix()
            }
            if (this.renderer) {
                this.renderer.setSize(this.width, this.height)
            }
        },
        render() {
            this.renderer.render(this.scene, this.camera)
            for (let i = 0; i < this.materials.length; i++) {
                const material = this.materials[i]
                if (material.emitRender) material.emitRender()
            }
            requestAnimationFrame(this.render)
        },
    },
}
</script>

<style lang="scss" scoped>
.edit-studio {
    width: 90%;
    display: flex;
    box-shadow: 0 5px 8px rgba(0, 0, 0, .2);
    &-left {
        width: 240px;
    }
    &-right {
        width: 240px;
    }
    &-center {
        flex: 1;
        overflow: hidden;
    }
}
</style>