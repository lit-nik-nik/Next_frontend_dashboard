import axios from "axios";

const API_URI = process.env.API_DB_URI

export const getOrders = async (page) => {
    let data;

    await axios.get(`${API_URI}/orders?_page=${page}`)
        .then(res  => data = {
            orders: res.data.orders,
            count: res.data.count,
            pages: res.data.pages,
            acitvePage: page
        })

    return data
}

