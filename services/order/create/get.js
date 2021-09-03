import axios from "axios";

const API_URI = process.env.API_DB_URI

export const getListsOrder = async (token) => {
    const options = {
        headers: {
            'Authorization': token
        }
    }

    let listOrder = {},
        error

    await axios.get(`${API_URI}/lists`, options)
        .then(res  => {
            for (let key in res.data.lists) {
                if (key !== 'employers') listOrder[key] = res.data.lists[key]
            }
        })
        .catch(err => error = err)

    if (error) return error
    else return listOrder
}