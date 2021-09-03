import axios from "axios";

const API_URI = process.env.API_DB_URI

export const getOrder = async (id) => {
    let order;

    await axios.get(`${API_URI}/orders/${id}`)
        .then(res  =>  order = res.data.order)

    return order
}

export const getImageOrder = async (id) => {
    let image;

    await axios.get(`${API_URI}/orders/sample/${id}`, {responseType: 'arraybuffer'})
        .then(res => image = Buffer.from(res.data, 'binary').toString('base64'))

    return image
}