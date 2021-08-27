import axios from "axios";

const API_URI =' http://192.168.2.10:3131'

export const authUser = async (login, pass) => {

    let data = {
            userName: login,
            password: pass
        },
        result

    return await axios.post(`${API_URI}/api/auth/login`, data)
        .then(res => res)
        .catch(err => err.response)


}