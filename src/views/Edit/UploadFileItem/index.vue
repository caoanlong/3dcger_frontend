<template>
    <div class="upload-file">
        <svg-icon icon-class="file"></svg-icon>
        <input 
            class="upload-file" 
            type="file" 
            name="map" 
            :disabled="disabled"
            :style="{cursor: disabled ? 'not-allowed' : 'pointer' }"
            @change="handleChange" />
    </div>
</template>

<script>
export default {
    name: 'UploadFileItem',
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleChange(e) {
            this.$emit('change', e.target.files[0])
        }
    },
}
</script>

<style lang="scss" scoped>
.upload-file {
    $file-btn-color: #666666;
    $file-btn-bg-color: #222222;
    width: 36px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 18px;
    color: #666666;
    background-color: $file-btn-bg-color;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    position: relative;
    &:hover {
        color: lighten($file-btn-color, 2%);
        background-color: lighten($file-btn-bg-color, 2%);
    }
    input {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        width: 100%;
        outline: none;
        opacity: 0;
        cursor: pointer;
    }
}
</style>