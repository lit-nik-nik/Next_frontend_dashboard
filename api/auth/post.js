import {myAxios} from "../settings";

export const authUser = async (login, pass, barcode) => {
    let data

    if (barcode) data = {barcode}
    else {
        data = {
            userName: login,
            password: pass
        }
    }

    return await myAxios.post(`/api/auth/login`, data)

}