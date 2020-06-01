export const name = {
    label: '名称',
    value: ''
}
export const description = {
    label: '描述',
    value: ''
}
export const obj = {
    label: 'OBJ模型',
    fileName: '',
    url: '',
    file: ''
}
export const hdr = {
    label: 'HDR贴图',
    fileName: '',
    url: '',
    file: ''
}
export const exposure = {
    label: '曝光度',
    value: 1
}

export const mapList = [
    {
        class: 'value',
        type: 'metalness',
        label: '金属性',
        value: 1
    }, {
        class: 'map',
        type: 'metalnessMap',
        label: '金属性贴图',
        fileName: '',
        url: '',
        file: ''
    }, {
        class: 'value',
        type: 'roughness',
        label: '粗糙度',
        value: 0
    }, {
        class: 'map',
        type: 'roughnessMap',
        label: '粗糙度贴图',
        fileName: '',
        url: '',
        file: ''
    }, {
        class: 'color',
        type: 'color',
        label: '漫反射',
        value: '#ffffff'
    }, {
        class: 'map',
        type: 'map',
        label: '漫反射贴图',
        fileName: '',
        url: '',
        file: ''
    }, {
        class: 'color',
        type: 'emissive',
        label: '自发光',
        value: '#000000'
    }, {
        class: 'value',
        type: 'emissiveIntensity',
        label: '自发光强度',
        value: 1
    }, {
        class: 'map',
        type: 'emissiveMap',
        label: '自发光贴图',
        fileName: '',
        url: '',
        file: ''
    }, {
        class: 'value',
        type: 'aoMapIntensity',
        label: 'AO强度',
        value: 0.2
    }, {
        class: 'map',
        type: 'aoMap',
        label: 'AO贴图',
        fileName: '',
        url: '',
        file: ''
    }, {
        class: 'map',
        type: 'normalMap',
        label: '法线贴图',
        fileName: '',
        url: '',
        file: ''
    }, {
        class: 'map',
        type: 'bumpMap',
        label: '凹凸贴图',
        fileName: '',
        url: '',
        file: ''
    }, {
        class: 'map',
        type: 'displacementMap',
        label: '置换贴图',
        fileName: '',
        url: '',
        file: ''
    }, {
        class: 'value',
        type: 'opacity',
        label: '透明度',
        value: 1
    }, {
        class: 'map',
        type: 'alphaMap',
        label: 'ALPHA贴图',
        fileName: '',
        url: '',
        file: ''
    }, {
        class: 'value',
        type: 'refractionRatio',
        label: '折射率',
        value: 0.98
    }
]