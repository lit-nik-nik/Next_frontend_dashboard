import {myAxios} from "../settings";

export const postAtOrders = async (data) => {

    return await myAxios.post(`/api/at-order/add`, data)

}

export const addExtraData = async (data) => {

    return await myAxios.post('/api/extra-data/get', data)

}
