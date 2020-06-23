<template>
    <div class="mine clearfix">
        <div 
            class="mine-item" 
            v-for="item in list" 
            :key="item.id.toString()" 
            @click="handleInfo(item.id.toString())">
            <svg-icon 
                className="mine-item-del" 
                icon-class="del" 
                @click.native.stop="handleDel(item.id.toString())">
            </svg-icon>
            <div class="mine-item-thumbnail" :style="`background-image:${item.skyBgColor}`">
                <div 
                    class="mine-item-thumbnail-img" 
                    :style="`background-image:url(${$staticUrl + item.id.toString() + '/' + item.thumbnail})`">
                </div>
            </div>
            <div class="mine-item-title">{{item.id.toString()}}</div>
        </div>
        <div class="mine-item" style="color:#999" @click="handleAdd">
            <div class="mine-item-add">+添加</div>
        </div>
    </div>
</template>

<script>
import Scene from '@/api/Scene'
import request from '@/utils/request'
export default {
    data() {
        return {
            list: []
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            Scene.findList().then(res => {
                this.list = res.list
            })
        },
        handleInfo(id) {
            this.$router.push({name: 'edit', query: { id }})
        },
        handleAdd() {
            this.$router.push({name: 'edit'})
        },
        handleDel(id) {
            Scene.del({ id }).then(res => {
                this.getList()
                this.$notify({
                    group: 'foo',
                    type: 'success',
                    title: 'Tips',
                    text: 'The scene is removed!'
                })
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.mine {
    padding: 50px;
    &-item {
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
        width: 300px;
        height: 250px;
        text-align: center;
        background-color: #ffffff;
        cursor: pointer;
        box-shadow: 0 3px 10px rgba(0, 0, 0, .2);
        position: relative;
        user-select: none;
        &-del {
            position: absolute;
            top: 5px;
            right: 5px;
        }
        &-add {
            width: 100%;
            height: 250px;
            line-height: 250px;
        }
        &-thumbnail {
            width: 100%;
            height: 210px;
            &-img {
                width: 100%;
                height: 210px;
                background-size: 100%;
                background-position: center;
                background-repeat: no-repeat;
                transition: background-size .3s;
                &:hover {
                    background-size: 120%;
                }
            }
        }
        &-title {
            height: 40px;
            line-height: 40px;
        }
    }
}
</style>