export function formDataReq(json) {
    const formData = new FormData()
    for (let attr in json) {
        if (json[attr]) formData.append(attr, json[attr])
    };
    return formData
}