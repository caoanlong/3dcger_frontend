<template>
    <div class="out-line" :style="{height: height + 'px'}">
        <div 
            class="scene" 
            :class="{'active': currentObject && currentObject.uuid == scene.uuid}" 
            @click="handleSelect(scene)">
            {{scene && (scene.name || scene.type)}}
        </div>
        <div class="render" 
            :class="{'active': currentObject && (currentObject.uuid == renderer.uuid)}" 
            @click="handleSelect(renderer)">
            {{renderer && (renderer.name || renderer.type)}}
        </div>
        <!-- <div class="camera" 
            :class="{'active': currentObject && currentObject.uuid == camera.uuid}" 
            @click="handleSelect(camera)">
            {{camera && (camera.name || camera.type)}}
        </div> -->
        <ModelItem :model="scene.children[0]" v-if="scene && scene.children && scene.children[0]"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ModelItem from './ModelItem'
export default {
    components: {
        ModelItem
    },
    props: {
        height: {
            type: Number,
            default: 250
        }
    },
    computed: {
        ...mapGetters(['scene', 'renderer', 'camera', 'currentObject'])
    },
    methods: {
        handleSelect(obj) {
            this.$store.commit('setCurrentObject', obj)
        }
    },
}
</script>

<style lang="scss" scoped>
.out-line {
    border: 1px solid #262626;
    overflow: auto;
    .active {
        background-color: #737373;
    }
    .scene, .render, .camera, .sky {
        border-top: 1px solid #222222;
        height: 20px;
        line-height: 20px;
        color: #cbcbcb;
        font-size: 14px;
        padding: 0 12px;
        position: relative;
        &:hover {
            background-color: #4a4a4a;
        }
        &:before {
            position: absolute;
            top: 6px;
            left: 4px;
            display: block;
            content: "";
            width: 4px;
            height: 4px;
            border-left: 1px solid #999999;
            border-bottom: 1px solid #999999;
        }
    }
    .scene {
        border-top: none;
    }
    .slist {
        color: #cbcbcb;
        font-size: 14px;
        &-item {
            height: 20px;
            line-height: 20px;
            padding: 0 24px;
            position: relative;
            &:hover {
                background-color: #4a4a4a;
            }
            &:before {
                position: absolute;
                top: 5px;
                left: 12px;
                display: block;
                content: "";
                width: 6px;
                height: 6px;
                border-left: 1px solid #dddddd;
                border-bottom: 1px solid #dddddd;
            }
        }
    }
}
</style>