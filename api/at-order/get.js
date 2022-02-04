import {myAxios} from "../settings";

export const getBarcodes = async () => {
    return await myAxios.get(`/api/at-order/data`)
}

export const getOrderAt = async (id) => {
    return await myAxios.get(`/orders/exists/${id}`)
}

export const getServerTime = async () => {
    let time

    await myAxios.get(`/api/time`)
        .then(res => time = res.data.ts)

    return time
}
