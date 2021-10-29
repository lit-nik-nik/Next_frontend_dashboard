import {myAxios} from "../settings";

export const getBarcodes = async () => {
    return await myAxios.get(`/api/at-order/data`)
}

export const getOrderAt = async (id) => {
    return await myAxios.get(`/orders/exists/${id}`)
}
