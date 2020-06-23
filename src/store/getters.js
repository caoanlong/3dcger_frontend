const getters = {
    width: (state) => state.studio.width,
    height: (state) => state.studio.height,
    scene: (state) => state.studio.scene,
    renderer: (state) => state.studio.renderer,
    camera: (state) => state.studio.camera,
    renderTarget: (state) => state.studio.renderTarget,
    materials: (state) => state.studio.materials,

    currentObject: (state) => state.studio.currentObject,
    currentMaterial: (state) => state.studio.currentMaterial,

    exposure: (state) => state.studio.exposure,
    gammaFactor: (state) => state.studio.gammaFactor,

    skyUrl: (state) => state.studio.skyUrl,
    skyFile: (state) => state.studio.skyFile,
    skyTexture: (state) => state.studio.skyTexture,
    skyBgMode: (state) => state.studio.skyBgMode,
    skyBgColorMode: (state) => state.studio.skyBgColorMode,
    skyBgColor: (state) => state.studio.skyBgColor,

    fov: (state) => state.studio.fov,
    near: (state) => state.studio.near,
    far: (state) => state.studio.far,
}
export default getters