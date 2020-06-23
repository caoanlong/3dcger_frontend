import THREE from '@/utils/three.module'
import RefracMaterial from '@/utils/RefracMaterial'
import store from '@/store'
const DEFAULT_FOV_DEG = 45
export const DEFAULT_TAN_FOV = Math.tan((DEFAULT_FOV_DEG / 2) * Math.PI / 180)
const DEFAULT_HALF_FOV = (DEFAULT_FOV_DEG / 2) * Math.PI / 180
const SAFE_RADIUS_RATIO = Math.sin(DEFAULT_HALF_FOV)

export function formDataReq(json) {
    const formData = new FormData()
    for (let attr in json) {
        if (json[attr]) formData.append(attr, json[attr])
    };
    return formData
}

export const createMaterial = (type) => {
    if (type === 'physical') {
        return new THREE.MeshPhysicalMaterial({
            metalness: 1,
            roughness: 0,
            aoMapIntensity: 0.2,
            transparent: true,
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1,
            alphaTest: 0.5
        })
    } else if (type === 'refraction') {
        return new RefracMaterial({
            metalness: 1,
            roughness: 0,
            refractionRatio: 0.7,
            envMap: store.getters.skyTexture,
            envMapMode: THREE.EquirectangularRefractionMapping
        })
    }
}

export function setMap(url, curMtl, prop, type) {
    if (type === 'tga') {
        new THREE.TGALoader().load(url, (texture) => {
            texture.encoding = THREE.GammaEncoding
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
            if (curMtl.material) {
                curMtl.material[prop] = texture
                curMtl.material.needsUpdate = true
            } else {
                curMtl[prop] = texture
                curMtl.needsUpdate = true
            }
        })
    } else {
        new THREE.TextureLoader().load(url, (texture) => {
            texture.encoding = THREE.GammaEncoding
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
            if (curMtl.material) {
                curMtl.material[prop] = texture
                curMtl.material.needsUpdate = true
            } else {
                curMtl[prop] = texture
                curMtl.needsUpdate = true
            }
        })
    }
}

export function getFileSuffixByName(fileName) {
    const arr = fileName.split('.')
    return arr[arr.length-1]
}

export function reduceVertices(model, func) {
    let value = 0
    const vector = new THREE.Vector3()
    model.traverse((object) => {
        let i, l
        object.updateWorldMatrix(false, false)

        let geometry = object.geometry

        if (geometry !== undefined) {
            if (geometry.isGeometry) {
                let vertices = geometry.vertices;

                for (i = 0, l = vertices.length; i < l; i++) {
                    vector.copy(vertices[i])
                    vector.applyMatrix4(object.matrixWorld)

                    value = func(value, vector)
                }

            } else if (geometry.isBufferGeometry) {
                let attribute = geometry.attributes.position

                if (attribute !== undefined) {
                    for (i = 0, l = attribute.count; i < l; i++) {
                        vector.fromBufferAttribute(attribute, i).applyMatrix4(object.matrixWorld)

                        value = func(value, vector)
                    }
                }
            }
        }
    });
    return value
}

export function updateFraming(group) {
    const boundingBox = new THREE.Box3()
    const size = new THREE.Vector3()
    boundingBox.setFromObject(group)
    boundingBox.getSize(size)
    const center = boundingBox.getCenter(new THREE.Vector3)

    let idealCameraDistance = 0

    const radiusSquared = (value, vertex) => Math.max(value, center.distanceToSquared(vertex))
    const framedRadius = Math.sqrt(reduceVertices(group, radiusSquared))

    idealCameraDistance = framedRadius / SAFE_RADIUS_RATIO

    const horizontalFov = (value, vertex) => {
        vertex.sub(center)
        const radiusXZ = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z)
        return Math.max(value, radiusXZ / (idealCameraDistance - Math.abs(vertex.y)))
    };
    return reduceVertices(group, horizontalFov) / DEFAULT_TAN_FOV
    // this.fieldOfViewAspect = reduceVertices(group, horizontalFov) / DEFAULT_TAN_FOV
}

/**
 * Converts a base64 string which represents a data url
 * into a Blob of the same contents.
 */
export const dataUrlToBlob = async (base64DataUrl) => {
    return new Promise((resolve, reject) => {
        const sliceSize = 512
        const typeMatch = base64DataUrl.match(/data:(.*);/)

        if (!typeMatch) {
            return reject(new Error(`${base64DataUrl} is not a valid data Url`))
        }

        const type = typeMatch[1]
        const base64 = base64DataUrl.replace(/data:image\/\w+;base64,/, '')

        const byteCharacters = atob(base64)
        const byteArrays = []

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize)

            const byteNumbers = new Array(slice.length)
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i)
            }

            const byteArray = new Uint8Array(byteNumbers)
            byteArrays.push(byteArray)
        }

        resolve(new Blob(byteArrays, { type }))
    })
}