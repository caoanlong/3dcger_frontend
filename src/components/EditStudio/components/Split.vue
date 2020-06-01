<template>
    <div class="split" :id="'split' + i">
        <div class="split-up"></div>
        <div class="split-down"></div>
    </div>
</template>
<script>
export default {
    props: {
        i: {
            type: String,
            default: '0'
        }
    },
    data() {
        return {
            currentY: 0,
            flag: false
        }
    },
    mounted() {
        const split = document.getElementById('split' + this.i)
        this.startDrag(split, (dis) => {
            
        })
    },
    methods: {
        startDrag(target, callback) {
            target.onmousedown = (event) => {
                this.flag = true;
                if (!event) {
                    event = window.event
                    //
                    target.onselectstart = () => {
                        return false;
                    }
                }
                const e = event;
                this.currentY = e.clientY;

                document.addEventListener('mousemove', this.move)
                document.addEventListener('mouseup', this.end)
            }
        },
        move() {
            const e = event ? event : window.event
            if (this.flag) {
                const nowY = e.clientY;
                const disY = nowY - this.currentY

                this.$emit('change', disY)
                
                if (event.preventDefault) {
                    event.preventDefault()
                }
                return false;
            }
        },
        end() {
            this.flag = false
            document.removeEventListener('mousemove', this.move, false)
            document.removeEventListener('mouseup', this.end, false)
        }
    },
}
</script>
<style lang="scss" scoped>
.split {
    margin: 4px 0;
    cursor: row-resize;
    &-up {
        height: 1px;
        background-color: #404040;
    }
    &-down {
        margin-top: 1px;
        height: 1px;
        background-color: #262626;
    }
}
</style>