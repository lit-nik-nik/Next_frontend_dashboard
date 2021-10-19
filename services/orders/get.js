import axios from "axios";
import {myOptions} from "../settings";

const API_URI = process.env.API_DB_URI

export const getOrders = async (token, page, filter, limit = 100) => {

    let filterAll = {}

    if (filter) filterAll.filter = `&_filter=${filter}`


    let res = await axios.get(`${API_URI}/orders?_page=${page}&_limit=${limit}${filterAll.filter}`, myOptions(token))

    return res
}

