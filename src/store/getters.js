const getters = {
    scene: (state) => state.studio.scene,
    renderer: (state) => state.studio.renderer,
    camera: (state) => state.studio.camera,
    pmremGenerator: (state) => state.studio.pmremGenerator,

    currentOutlineItem: (state) => state.studio.currentOutlineItem,

    exposure: (state) => state.studio.exposure,
    gammaFactor: (state) => state.studio.gammaFactor,

    skyUrl: (state) => state.studio.skyUrl,
    skyBgMode: (state) => state.studio.skyBgMode,
    skyBgColorMode: (state) => state.studio.skyBgColorMode,
    skyBgColor: (state) => state.studio.skyBgColor,
}
export default getters