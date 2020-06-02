const getters = {
    scene: (state) => state.studio.scene,
    renderer: (state) => state.studio.renderer,
    camera: (state) => state.studio.camera,
    materials: (state) => state.studio.materials,

    currentOutlineItem: (state) => state.studio.currentOutlineItem,

    exposure: (state) => state.studio.exposure,
    gammaFactor: (state) => state.studio.gammaFactor,

    skyUrl: (state) => state.studio.skyUrl,
    skyTexture: (state) => state.studio.skyTexture,
    skyBgMode: (state) => state.studio.skyBgMode,
    skyBgColorMode: (state) => state.studio.skyBgColorMode,
    skyBgColor: (state) => state.studio.skyBgColor,

    fov: (state) => state.studio.fov,
    near: (state) => state.studio.near,
    far: (state) => state.studio.far,
}
export default getters