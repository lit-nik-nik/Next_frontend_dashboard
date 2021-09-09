import axios from "axios";

const API_URI = process.env.API_DB_URI

export const postAtOrders = async (data) => {

    return await axios.post(`${API_URI}/api/at-order/add`, data)

}
