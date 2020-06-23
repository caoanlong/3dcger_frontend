<template>
    <div class="edit-studio" :style="{height: height + 'px'}">
        <EditLeftBlock class="edit-studio-left" :height="height" @save="handleSave"/>
        <div 
            id="view" 
            class="edit-studio-center" 
            :style="`background:${skyBgColor}`">
        </div>
        <EditRightBlock class="edit-studio-right" :height="height"/>
    </div>
</template>

<script>
import THREE from '@/utils/three.module'
import EditLeftBlock from './EditLeftBlock'
import EditRightBlock from './EditRightBlock'
import { mapGetters } from 'vuex'
import '@/utils/OrbitControls'
import '@/utils/OBJLoader'
import '@/utils/TGALoader'
import { material, setMap, getFileSuffixByName, dataUrlToBlob }  from '@/utils/common'
import Scene from '@/api/Scene'
export default {
    components: {
        EditLeftBlock,
        EditRightBlock
    },
    data() {
        return {
            aspect: 1,
            fileUrls: ''
        }
    },
    computed: {
        ...mapGetters([
            'width',
            'height',
            'scene', 
            'renderer', 
            'camera', 
            'skyBgColor', 
            'skyFile', 
            'skyBgMode', 
            'exposure', 
            'gammaFactor', 
            'materials'
        ])
    },
    created() {
        const id = this.$route.query.id
        if (id) {
            this.getInfo(id)
        }
        window.addEventListener('resize', this.resizeWin, false)
    },
    mounted() {
        this.resizeWin()
        this.canvas = document.getElementById('view')
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
                const width = view.offsetWidth
                const height = window.innerHeight - 100
                this.$store.commit('setSize', { width, height })
                this.aspect = width / height
            }
            if (this.camera) {
                this.camera.aspect = this.aspect
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
        async handleSave() {
            if (!this.scene.children || this.scene.children.length == 0) {
                this.$notify({
                    group: 'foo',
                    type: 'warn',
                    title: 'Warning',
                    text: 'The scene is empty!'
                })
                return
            }
            const formData = new FormData()
            const id = this.$route.query.id
            if (id) {
                formData.append('id', id)
                formData.append('modelNames', this.fileUrls.join(','))
            }
            const thumbnailBlob = await this.toBlob({ mimeType: 'image/png' })
            formData.append('thumbnailFile', new File([thumbnailBlob], 'thumbnail.png', {type: 'image/png'}))
            formData.append('skyBgColor', this.skyBgColor)
            if (this.skyFile) formData.append('skyFile', this.skyFile)

            formData.append('skyBgMode', this.skyBgMode)
            formData.append('exposure', this.exposure)
            formData.append('gammaFactor', this.gammaFactor)

            for (let i = 0; i < this.scene.children.length; i++) {
                const item = this.scene.children[i]
                if (item.cgersFile) {
                    formData.append('modelFiles', item.cgersFile)
                }
                
            }
            // file 为了保持索引对号入座，占位用
            const file = new File([0], 'null')
            for (let j = 0; j < this.materials.length; j++) {
                const item = this.materials[j]

                formData.append('geoNames', item.material.geoName)
                formData.append('colors', '#' + item.material.color.getHexString())
                formData.append('metalnesss', item.material.metalness)
                formData.append('roughnesss', item.material.roughness)
                formData.append('aoMapIntensitys', item.material.aoMapIntensity)
                formData.append('emissives', '#' + item.material.emissive.getHexString())
                formData.append('emissiveIntensitys', item.material.emissiveIntensity)

                formData.append('colorMapFiles', item.colorMapFile || file)
                formData.append('metalnessMapFiles', item.metalnessMapFile || file)
                formData.append('roughnessMapFiles', item.roughnessMapFile || file)
                formData.append('normalMapFiles', item.normalMapFile || file)
                formData.append('aoMapFiles', item.aoMapFile || file)
                formData.append('emissiveMapFiles', item.emissiveMapFile || file)
                formData.append('alphaMapFiles', item.alphaMapFile || file)

                if (id) {
                    formData.append('materialIds', item.id)
                    formData.append('colorMapUrls', item.colorMapName)
                    formData.append('metalnessMapUrls', item.metalnessMapName)
                    formData.append('roughnessMapUrls', item.roughnessMapName)
                    formData.append('normalMapUrls', item.normalMapName)
                    formData.append('aoMapUrls', item.aoMapName)
                    formData.append('emissiveMapUrls', item.emissiveMapName)
                    formData.append('alphaMapUrls', item.alphaMapName)
                }
            }

            if (id) {
                Scene.update(formData, (e) => {
                    console.log((e.loaded / e.total * 100).toFixed(2) + '%')
                }).then(res => {
                    console.log(res)
                    this.$router.push({name: 'mine'})
                })
            } else {
                Scene.save(formData, (e) => {
                    console.log((e.loaded / e.total * 100).toFixed(2) + '%')
                }).then(res => {
                    console.log(res)
                    this.$router.push({name: 'mine'})
                })
            }
        },
        getInfo(id) {
            Scene.findById({ id }).then(res => {
                // console.log(res.id.toString())
                console.log(res)
                const baseUrl = this.$staticUrl + id + '/'
                this.$store.commit('setExposure', res.exposure)
                this.$store.commit('setGammaFactor', res.gammaFactor)
                this.$store.commit('setSkyBgMode', res.skyBgMode)
                this.$store.commit('setSkyBgColor', res.skyBgColor)
                if (res.skyBgUrl) {
                    this.$store.commit('setSkyByUrl', baseUrl + res.skyBgUrl)
                }
                this.fileUrls = res.modelFileUrls.split(',')
                for (let i = 0; i < this.fileUrls.length; i++) {
                    const fileUrl = baseUrl + this.fileUrls[i]
                    const objLoader = new THREE.OBJLoader()
                    objLoader.load(fileUrl, (group) => {
                        console.log(group)
                        group.cgersFileUrl = fileUrl
                        this.walk(group, res.materials, baseUrl)
                        this.$store.commit('addMesh', group)
                        this.$store.commit('setCurrentMaterial', this.materials[0])
                    })
                }
            })
        },
        walk(group, materials, baseUrl) {
            for (let i = 0; i < group.children.length; i++) {
                const item = group.children[i]
                if (item.type === 'Mesh') {
                    const mtl = material.clone()
                    mtl.geoName = item.name
                    const mt = materials.find(mt => mt.geoName == item.name)
                    const materialProp = {
                        id: mt.id.toString()
                    }
                    mtl.metalness = mt.metalness
                    mtl.roughness = mt.roughness
                    mtl.emissiveIntensity = mt.emissiveIntensity
                    mtl.aoMapIntensity = mt.aoMapIntensity
                    mtl.color.set(mt.color)
                    mtl.emissive.set(mt.emissive)
                    if (mt.colorMapUrl) {
                        materialProp.colorMapUrl = baseUrl + mt.colorMapUrl
                        materialProp.colorMapName = mt.colorMapUrl
                        setMap(baseUrl + mt.colorMapUrl, mtl, 'map', getFileSuffixByName(mt.colorMapUrl))
                    }
                    if (mt.metalnessMapUrl) {
                        materialProp.metalnessMapUrl = baseUrl + mt.metalnessMapUrl
                        materialProp.metalnessMapName = mt.metalnessMapUrl
                        setMap(baseUrl + mt.metalnessMapUrl, mtl, 'metalnessMap', getFileSuffixByName(mt.metalnessMapUrl))
                    }
                    if (mt.roughnessMapUrl) {
                        materialProp.roughnessMapUrl = baseUrl + mt.roughnessMapUrl
                        materialProp.roughnessMapName = mt.roughnessMapUrl
                        setMap(baseUrl + mt.roughnessMapUrl, mtl, 'roughnessMap', getFileSuffixByName(mt.roughnessMapUrl))
                    }
                    if (mt.normalMapUrl) {
                        materialProp.normalMapUrl = baseUrl + mt.normalMapUrl
                        materialProp.normalMapName = mt.normalMapUrl
                        setMap(baseUrl + mt.normalMapUrl, mtl, 'normalMap', getFileSuffixByName(mt.normalMapUrl))
                    }
                    if (mt.aoMapUrl) {
                        materialProp.aoMapUrl = baseUrl + mt.aoMapUrl
                        materialProp.aoMapName = mt.aoMapUrl
                        setMap(baseUrl + mt.aoMapUrl, mtl, 'aoMap', getFileSuffixByName(mt.aoMapUrl))
                    }
                    if (mt.emissiveMapUrl) {
                        materialProp.emissiveMapUrl = baseUrl + mt.emissiveMapUrl
                        materialProp.emissiveMapName = mt.emissiveMapUrl
                        setMap(baseUrl + mt.emissiveMapUrl, mtl, 'emissiveMap', getFileSuffixByName(mt.emissiveMapUrl))
                    }
                    if (mt.alphaMapUrl) {
                        materialProp.alphaMapUrl = baseUrl + mt.alphaMapUrl
                        materialProp.alphaMapName = mt.alphaMapUrl
                        setMap(baseUrl + mt.alphaMapUrl, mtl, 'alphaMap', getFileSuffixByName(mt.alphaMapUrl))
                    }
                    item.material = mtl
                    // TODO   mtlType: 'physical'
                    this.$store.commit('setMaterial', {
                        uuid: item.uuid, 
                        obj: item, 
                        mtlType: 'physical', 
                        material: mtl, 
                        materialProp 
                    })
                }
                if (item.children && item.children.length && item.type != 'LineSegments') {
                    this.walk(item, materials, baseUrl)
                }
            }
        },
        toBlob(mimeType, qualityArgument) {
            const canvas = this.renderer.domElement
            return new Promise(async (resolve, reject) => {
                if (!canvas.toBlob) {
                    return resolve(await dataUrlToBlob(canvas.toDataURL(mimeType, qualityArgument)));
                }
                canvas.toBlob((blob) => {
                    if (!blob) {
                        return reject(new Error('Unable to retrieve canvas blob'))
                    }
                    resolve(blob);
                }, mimeType, qualityArgument)
            })
        }
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