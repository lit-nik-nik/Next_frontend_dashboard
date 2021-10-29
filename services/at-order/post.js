import {myAxios} from "../settings";

export const postAtOrders = async (data) => {

    return await myAxios.post(`/api/at-order/add`, data)

}
