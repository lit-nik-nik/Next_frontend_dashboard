import axios from "axios";

const API_URI =' http://192.168.2.10:3131'

export const getListsOrder = async () => {
    let listOrder = {};

    await axios.get(`${API_URI}/lists`)
        .then(res  => {
            for (let key in res.data.lists) {
                if (
                    key !== 'employers'
                )
                listOrder[key] = res.data.lists[key]
            }
        })

    return listOrder
}