import {myAxios, myOptions} from "../settings";

export const getOrder = async (id, token) => {
    return await myAxios.get(`/orders/${id}`, myOptions(token))
}

export const getImageOrder = async (id, token) => {
    let image;

    await myAxios.get(`/orders/sample/${id}`, {responseType: 'arraybuffer', headers: {'Authorization': token}})
        .then(res => image = Buffer.from(res.data, 'binary').toString('base64'))

    return image
}