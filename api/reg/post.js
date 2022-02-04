import {myAxios} from "../settings";

export const regUser = async (data) => {
    return await myAxios.post(`/api/auth/register`, data)
        .then(res => res)
        .catch(err => err.response)

}