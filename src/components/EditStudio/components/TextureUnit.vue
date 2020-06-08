<template>
    <div class="texture">
        <div class="texture-left">
            <div class="texture-img">
                <img :src="mapUrl" alt="" v-if="mapUrl">
                <input
                    class="texture-img-upload" 
                    type="file" 
                    name="map"
                    @change="handleFileChange" />
            </div>
        </div>
        <div class="texture-right">
            <div class="texture-right-label">
                {{label}}
                <svg-icon 
                    className="texture-right-label-del" 
                    icon-class="del" 
                    @click.native="handleDel">
                </svg-icon>
            </div>
            <div class="texture-right-filename eclipsis">
                {{mapName || 'none'}}
            </div>
        </div>
    </div>
</template>

<script>
import ColorSelect from './ColorSelect'
export default {
    components: {
        ColorSelect
    },
    props: {
        label: {
            type: String,
            default: 'Label'
        },
        mapName: String,
        mapUrl: String
    },
    methods: {
        handleFileChange(e) {
            if (e.target.value) {
                this.$emit('img-change', e.target.files[0])
            }
        },
        handleDel() {
            this.$emit('img-change')
        }
    },
}
</script>

<style lang="scss" scoped>
.texture {
    display: flex;
    &-left {
        width: 46px;
        .texture-img {
            width: 42px;
            height: 42px;
            border: 1px solid #262626;
            background-color: #3c3c3c;
            background-image: linear-gradient(45deg, #222222 25%, transparent 25%, transparent 75%, #222222 75%, #222222), 
            linear-gradient(45deg, #222222 26%, transparent 26%, transparent 74%, #222222 74%, #222222);
            background-size: 10px 10px;
            background-position: 0 0, 5px 5px;
            position: relative;
            img {
                display: block;
                width: 100%;
            }
            &-upload {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 2;
                width: 100%;
                outline: none;
                opacity: 0;
                filter: opacity(0);
            }
        }
    }
    &-right {
        flex: 1;
        &-label {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #cbcbcb;
            position: relative;
            &-del {
                position: absolute;
                top: 3px;
                right: 0;
                font-size: 14px;
                cursor: pointer;
            }
        }
        &-filename {
            font-size: 12px;
            color: #838383;
        }
    }
}
</style>