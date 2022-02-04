import {myAxios, myOptions} from "../../settings";

export const getListsOrder = async (token) => {
    let listOrder = {}

    await myAxios.get(`/lists`, myOptions(token))
        .then(res  => {
            for (let key in res.data.lists) {
                if (key !== 'employers') listOrder[key] = res.data.lists[key]
            }
        })

    return listOrder
}