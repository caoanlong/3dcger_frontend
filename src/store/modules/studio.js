import EnvironmentScene from '@/utils/EnvironmentScene'
import '@/utils/RGBELoader'

function walk(node) {
    node.children = node.children.filter(item => item.type != 'LineSegments')
    if (node.children && node.children.length) {
        for (let i = 0; i < node.children.length; i++) {
            const item = node.children[i]
            walk(item)
        }
    }
}

function setSky(state, url) {
    const rgbeLoader = new THREE.RGBELoader().setDataType(THREE.UnsignedByteType)
    rgbeLoader.load(url, (hdrTexture, data) => {
        hdrTexture.encoding = THREE.RGBEEncoding
        hdrTexture.minFilter = THREE.NearestFilter
        hdrTexture.magFilter = THREE.NearestFilter
        hdrTexture.flipY = true
        const pmremGenerator = new THREE.PMREMGenerator(state.renderer)
        const texture = pmremGenerator.fromEquirectangular(hdrTexture).texture
        state.skyTexture = state.scene.environment = texture
        if (state.skyBgMode === 'Sky') state.scene.background = texture
    })
}

const studio = {
    state: {
        scene: null,
        renderer: null,
        camera: null,

        materials: [],

        currentObject: null,
        currentMaterial: null,

        exposure: 1,
        gammaFactor: 2.2,

        skyUrl: '',
        skyFile: null,
        skyTexture: null,
        skyBgMode: 'Color',
        skyBgColorMode: 'Gradient',
        skyBgColor: 'linear-gradient(#b7bdc8, #78797d)',

        fov: 45,
        near: 0.1,
        far: 10000
    },
    mutations: {
        reset: (state) => {
            if (state.scene) {
                state.scene.dispose()
                state.scene = null
            }
            if (state.renderer) {
                state.renderer.dispose()
                state.renderer = null
            }
            
            state.camera = null
            state.materials = []

            state.currentObject = null
            state.currentMaterial = null
            state.exposure = 1
            state.gammaFactor = 2.2
            state.skyUrl = ''
            state.skyFile = null
            state.skyTexture = null
            state.skyBgMode = 'Color'
            state.skyBgColorMode = 'Gradient'
            state.skyBgColor = 'linear-gradient(#b7bdc8, #78797d)'
            state.fov = 45
            state.near = 0.1
            state.far = 10000
        },
        init: (state, { el, width, height }) => {
            state.scene = new THREE.Scene()
            state.renderer = new THREE.WebGLRenderer({
                preserveDrawingBuffer: true,  //将渲染保存到缓冲区，否则获取的图片会是空的
                antialias: true, 
                alpha: true 
            })
            state.camera = new THREE.PerspectiveCamera(state.fov, width/height, state.near, state.far)
            state.camera.position.set(0, 0, 5)

            state.renderer.setSize(width, height)
            state.renderer.setClearColor('#ffffff', 0)
            state.renderer.autoClear = true;
            state.renderer.toneMappingExposure = state.exposure
            state.renderer.gammaFactor = state.gammaFactor
            state.renderer.outputEncoding = THREE.GammaEncoding
            state.renderer.physicallyCorrectLights = true
            state.renderer.setPixelRatio(window.devicePixelRatio)
            state.renderer.toneMapping = THREE.ACESFilmicToneMapping
            state.renderer.shadowMap.enabled = true
            state.renderer.shadowMap.type = THREE.PCFSoftShadowMap
            state.renderer.shadowMap.autoUpdate = false
            state.renderer.uuid = 'render001'
            state.renderer.type = 'Render'

            el.appendChild(state.renderer.domElement)

            const pmremGenerator = new THREE.PMREMGenerator(state.renderer)

            const defaultScene = new EnvironmentScene()
            const defaultEnvTextture = pmremGenerator.fromScene(defaultScene, 0.04).texture
            state.skyTexture = state.scene.environment = defaultEnvTextture
            defaultScene.dispose()

            state.currentObject = state.scene
        },
        addMesh: (state, mesh) => {
            // state.scene.children = []  // 临时
            state.scene.add(mesh)
        },
        setCurrentObject: (state, obj) => {
            state.currentObject = obj
            
            for (let i = 0; i < state.scene.children.length; i++) {
                walk(state.scene.children[i])
            }
            if (state.currentObject.type === 'Mesh') {
                // wireframe
                const geo = new THREE.EdgesGeometry( state.currentObject.geometry )
                const mat = new THREE.LineBasicMaterial( { color: '#0000ff', linewidth: 2 } )
                const wireframe = new THREE.LineSegments( geo, mat )
                state.currentObject.add( wireframe )
                
                const material = state.materials.find(item => item.uuid === obj.uuid)
                if (material) state.currentMaterial = material
            }
        },

        setExposure: (state, exposure) => {
            state.exposure = exposure
            state.renderer.toneMappingExposure = exposure
        },
        setGammaFactor: (state, gammaFactor) => {
            state.gammaFactor = gammaFactor
            state.renderer.gammaFactor = gammaFactor
        },
        setSkyByFile: (state, file) => {
            state.skyFile = file
            state.skyUrl = window.URL.createObjectURL(file)
            setSky(state, state.skyUrl)
        },
        setSkyByUrl: (state, url) => {
            state.skyUrl = url
            setSky(state, url)
        },
        setSkyBgMode: (state, mode) => {
            state.skyBgMode = mode
            if (mode === 'Color') {
                state.scene.background = null
            } else if (mode === 'Sky') {
                state.scene.background = state.skyTexture
            }
        },
        setSkyBgColorMode: (state, mode) => {
            state.skyBgColorMode = mode
            if (mode === 'Simple') {
                state.skyBgColor = state.skyBgColor.match(/(#[a-zA-Z0-9]{6})/g)[0]
            } else {
                state.skyBgColor = `linear-gradient(${state.skyBgColor}, ${state.skyBgColor})`
            }
        },
        setSkyBgColor: (state, color) => {
            state.skyBgColor = color
        },
        setSkyColor: (state, {pos, color}) => {
            if (pos === 'start') {
                if (state.skyBgColorMode === 'Simple') {
                    state.skyBgColor = color
                } else {
                    if (state.skyBgColor.includes('linear-gradient')) {
                        const endColor = state.skyBgColor.match(/(#[a-zA-Z0-9]{6})/g)[1]
                        state.skyBgColor = `linear-gradient(${color}, ${endColor})`
                    } else {
                        state.skyBgColor = `linear-gradient(${color}, ${color})`
                    }
                }
            } if (pos === 'end') {
                if (state.skyBgColor.includes('linear-gradient')) {
                    const startColor = state.skyBgColor.match(/(#[a-zA-Z0-9]{6})/g)[0]
                    state.skyBgColor = `linear-gradient(${startColor}, ${color})`
                } else {
                    state.skyBgColor = `linear-gradient(${state.skyBgColor}, ${color})`
                }
            }
        },
        setFov: (state, fov) => {
            state.fov = fov
            state.camera.fov = fov
            state.camera.updateProjectionMatrix()
        },
        setNear: (state, near) => {
            state.near = near
            state.camera.near = near
            state.camera.updateProjectionMatrix()
        },
        setFar: (state, far) => {
            state.far = far
            state.camera.far = far
            state.camera.updateProjectionMatrix()
        },
        setMaterial: (state, { uuid, material, materialProp}) => {
            const props = {
                id: '',
                colorMapName: '',
                colorMapUrl: '',
                metalnessMapName: '',
                metalnessMapUrl: '',
                roughnessMapName: '',
                roughnessMapUrl: '',
                normalMapName: '',
                normalMapUrl: '',
                aoMapName: '',
                aoMapUrl: '',
                emissiveMapName: '',
                emissiveMapUrl: '',
                alphaMapName: '',
                alphaMapUrl: ''
            }
            if (materialProp) {
                props.id = materialProp.id || ''
                props.colorMapName = materialProp.colorMapName || ''
                props.colorMapUrl = materialProp.colorMapUrl || ''
                props.metalnessMapName = materialProp.metalnessMapName || ''
                props.metalnessMapUrl = materialProp.metalnessMapUrl || ''
                props.roughnessMapName = materialProp.roughnessMapName || ''
                props.roughnessMapUrl = materialProp.roughnessMapUrl || ''
                props.normalMapName = materialProp.normalMapName || ''
                props.normalMapUrl = materialProp.normalMapUrl || ''
                props.aoMapName = materialProp.aoMapName || ''
                props.aoMapUrl = materialProp.aoMapUrl || ''
                props.emissiveMapName = materialProp.emissiveMapName || ''
                props.emissiveMapUrl = materialProp.emissiveMapUrl || ''
                props.alphaMapName = materialProp.alphaMapName || ''
                props.alphaMapUrl = materialProp.alphaMapUrl || ''
            }
            state.materials.push({
                uuid,
                material,
                ...props,
                onRender: (renderer, scene, camera) => {
                    return () => {
                        renderer.render(scene, camera)
                    }
                }
            })
        },
        setCurrentMaterial: (state, material) => {
            state.currentMaterial = material
        }
    }
}

export default studio