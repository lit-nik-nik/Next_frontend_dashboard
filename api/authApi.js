import {myAxios} from './settings';

export const AuthAPI = {
    getUsers () {
        return myAxios.get(`/lists`)
            .then(res => {
                return res.data
            })
    },
    authUser (login, pass, barcode) {
        let data

        if (barcode) data = {barcode}
        else {
            data = {
                userName: login,
                password: pass
            }
        }

        return myAxios.post(`/api/auth/login`, data)
    }
}