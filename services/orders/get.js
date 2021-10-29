import {myAxios, myOptions} from "../settings";

export const getOrders = async (token, page, filter, limit = 100) => {

    let filterAll = {}

    if (filter) filterAll.filter = `&_filter=${filter}`

    let res = await myAxios.get(`/orders?_page=${page}&_limit=${limit}${filterAll.filter}`, myOptions(token))

    return res
}

