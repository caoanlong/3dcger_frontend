<template>
    <header class="header">
        <div class="header-logo">3DCGER</div>
        <div class="header-nav">
            <div class="header-nav-item">首页</div>
            <div class="header-nav-item">设计师</div>
            <Btn text="登录/注册"></Btn>
        </div>
    </header>
</template>

<script>
import Btn from './Btn'
export default {
    components: {
        Btn
    }
}
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $header-height;
    background-color: #ffffff;
    box-shadow: 0 3px 5px rgba(0, 0, 0, .05);
    display: flex;
    justify-content: center;
    align-items: center;
    &-logo {
        position: absolute;
        top: 0;
        left: 0;
        height: $header-height;
        line-height: $header-height;
        color: #111111;
        font-size: 24px;
        padding-left: 20px;
    }
    &-nav {
        &-item {
            display: inline-block;
            margin-right: 20px;
            color: #333333;
            font-size: 16px;
            cursor: pointer;
            &:hover, &.active {
                color: $primary-color;
            }
        }
    }
    @media (max-width: $split-width) {
        &-nav {
            display: none;
        }
    }
}
</style>