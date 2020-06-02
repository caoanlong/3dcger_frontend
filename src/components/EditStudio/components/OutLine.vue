<template>
    <div class="out-line" :style="{height: height + 'px'}">
        <div 
            class="scene" 
            :class="{'active': currentOutlineItem == sceneLabel}" 
            @click="handleSelect(sceneLabel)">
            {{sceneLabel}}
        </div>
        <div class="slist">
            <div class="slist-item" 
                :class="{'active': currentOutlineItem == renderLabel}" 
                @click="handleSelect(renderLabel)">
                {{renderLabel}}
            </div>
            <div class="slist-item" 
                :class="{'active': currentOutlineItem == cameraLabel}" 
                @click="handleSelect(cameraLabel)">
                {{cameraLabel}}
            </div>
            <div class="slist-item" 
                :class="{'active': currentOutlineItem == skyLabel}" 
                @click="handleSelect(skyLabel)">
                {{skyLabel}}
            </div>
            <!-- <div class="slist-item" 
                :class="{'active': currentOutlineItem == group.type}" 
                v-for="(group, i) in (scene ? scene.children : [])" 
                :key="i"
                @click="handleSelect(group.type)">
                {{group.type}}
            </div>
            <div class="slist-item" 
                :class="{'active': currentOutlineItem == mesh.type}" 
                v-for="(mesh, j) in (scene && scene.children && scene.children.length ? scene.children[0].children[0] : [])" 
                :key="j"
                @click="handleSelect(mesh.type)">
                {{mesh.type}}
            </div> -->
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        height: {
            type: Number,
            default: 250
        }
    },
    data() {
        return {
            sceneLabel: 'Scene',
            renderLabel: 'Render',
            cameraLabel: 'Camera',
            skyLabel: 'Sky',
            modelLabel: 'Model',
        }
    },
    computed: {
        ...mapGetters(['scene', 'currentOutlineItem'])
    },
    methods: {
        handleSelect(label) {
            this.$store.commit('setCurrentOutlineItem', label)
        }
    },
}
</script>

<style lang="scss" scoped>
.out-line {
    border: 1px solid #262626;
    background-image: linear-gradient(0deg, #383838 92%, #2f2f2f 8%);
    background-size: 100% 20px;
    overflow: hidden;
    .active {
        background-color: #737373;
    }
    .scene {
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
            top: 8px;
            left: 3px;
            display: block;
            content: "";
            width: 6px;
            height: 6px;
            border-top: 2px solid #dddddd;
        }
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