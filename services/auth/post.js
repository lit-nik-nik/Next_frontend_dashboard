import axios from "axios";

const API_URI = process.env.API_DB_URI

export const authUser = async (login, pass) => {

    let data = {
            userName: login,
            password: pass
        }

    return await axios.post(`${API_URI}/api/auth/login`, data)
        .then(res => res)
        .catch(err => err.response)


}