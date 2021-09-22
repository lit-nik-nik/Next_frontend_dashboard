import axios from "axios";
import {myOptions} from "../../settings";

const API_URI = process.env.API_DB_URI

export const getListsOrder = async (token) => {
    const options = myOptions(token)

    let listOrder = {}

    await axios.get(`${API_URI}/lists`, options)
        .then(res  => {
            for (let key in res.data.lists) {
                if (key !== 'employers') listOrder[key] = res.data.lists[key]
            }
        })

    return listOrder
}