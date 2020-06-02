import EnvironmentScene from '@/utils/EnvironmentScene'
import '@/utils/RGBELoader'

const studio = {
    state: {
        scene: null,
        renderer: null,
        camera: null,

        materials: [],

        currentOutlineItem: 'Sky',

        exposure: 1,
        gammaFactor: 2.2,

        skyFileName: '',
        skyUrl: '',
        skyTexture: null,
        skyBgMode: 'Color',
        skyBgColorMode: 'Gradient',
        skyBgColor: 'linear-gradient(#b7bdc8, #a5a9b4)',

        fov: 45,
        near: 0.1,
        far: 1000
    },
    mutations: {
        init: (state, { el, width, height }) => {
            state.scene = new THREE.Scene()
            state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
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

            el.appendChild(state.renderer.domElement)

            const pmremGenerator = new THREE.PMREMGenerator(state.renderer)

            const defaultScene = new EnvironmentScene()
            const defaultEnvTextture = pmremGenerator.fromScene(defaultScene, 0.04).texture
            state.skyTexture = state.scene.environment = defaultEnvTextture
            defaultScene.dispose()
        },
        addMesh: (state, mesh) => {
            state.scene.add(mesh)
        },
        setCurrentOutlineItem: (state, label) => {
            state.currentOutlineItem = label
        },
        setExposure: (state, exposure) => {
            state.exposure = exposure
            state.renderer.toneMappingExposure = exposure
        },
        setGammaFactor: (state, gammaFactor) => {
            state.gammaFactor = gammaFactor
            state.renderer.gammaFactor = gammaFactor
        },
        setSky: (state, file) => {
            state.skyFileName = file.name
            state.skyUrl = window.URL.createObjectURL(file)
            const rgbeLoader = new THREE.RGBELoader().setDataType(THREE.UnsignedByteType)
            rgbeLoader.load(state.skyUrl, (hdrTexture, data) => {
                hdrTexture.encoding = THREE.RGBEEncoding
                hdrTexture.minFilter = THREE.NearestFilter
                hdrTexture.magFilter = THREE.NearestFilter
                hdrTexture.flipY = true
                const pmremGenerator = new THREE.PMREMGenerator(state.renderer)
                const texture = pmremGenerator.fromEquirectangular(hdrTexture).texture
                state.skyTexture = state.scene.environment = texture
                if (state.skyBgMode === 'Sky') state.scene.background = texture
            })
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
        setMaterial: (state, material) => {
            state.materials.push({
                material,
                onRender: (renderer, scene, camera) => {
                    return () => {
                        renderer.render(scene, camera)
                    }
                }
            })
        }
    }
}

export default studio