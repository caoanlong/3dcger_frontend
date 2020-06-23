import THREE from '@/utils/three.module'

import shader from './SubsurfaceScatteringShader'

THREE.ComMaterial = function(parameters) {
    parameters = Object.assign({}, parameters)
    THREE.MeshPhongMaterial.call(this)
    this.thicknessMap = null
    this.thicknessColor = new THREE.Color(0xffffff)
    this.thicknessDistortion = 0.1
    this.thicknessAmbient = 0.0
    this.thicknessAttenuation = 0.1
    this.thicknessPower = 2.0
    this.thicknessScale = 10.0
    this.uniforms = shader.uniforms
    // this.uniforms = THREE.UniformsUtils.merge([
    //     THREE.ShaderLib.phong.uniforms,
    //     // {
    //     //     // your custom uniforms or overrides to built-ins
    //     //     time: { type: 'f', value: 0 },
    //     //     thicknessMap: { type: 't', value: parameters.thicknessMap || new THREE.Texture() },
    //     //     thicknessRepeat: { type: 'v3', value: parameters.thicknessRepeat || new THREE.Vector2() },
    //     //     thicknessPower: { type: 'f', value: 20 },
    //     //     thicknessScale: { type: 'f', value: 4 },
    //     //     thicknessDistortion: { type: 'f', value: 0.185 },
    //     //     thicknessAmbient: { type: 'f', value: 0.0 },
    //     // }
    //     {
    //         "thicknessMap": { value: parameters.thicknessMap || null },
    //         "thicknessColor": { value: parameters.thicknessColor || new THREE.Color(0xffffff) },
    //         "thicknessDistortion": { value: parameters.thicknessDistortion || 0.1 },
    //         "thicknessAmbient": { value: parameters.thicknessAmbient || 0.0 },
    //         "thicknessAttenuation": { value: parameters.thicknessAttenuation || 0.1 },
    //         "thicknessPower": { value: parameters.thicknessPower || 2.0 },
    //         "thicknessScale": { value: parameters.thicknessScale || 10.0 }
    //     }
    // ])
    setFlags(this)
    this.setValues(parameters)
}

THREE.ComMaterial.prototype = Object.create(THREE.MeshPhongMaterial.prototype)
THREE.ComMaterial.prototype.constructor = THREE.ComMaterial
THREE.ComMaterial.prototype.isMeshPhongMaterial = true

THREE.ComMaterial.prototype.copy = function (source) {
    THREE.MeshPhongMaterial.prototype.copy.call(this, source)
    this.uniforms = THREE.UniformsUtils.clone(source.uniforms)
    setFlags(this)
    return this
}

function setFlags(material) {
    material.vertexShader = shader.vertexShader
    material.fragmentShader = shader.fragmentShader
    material.type = 'ComMaterial'
}