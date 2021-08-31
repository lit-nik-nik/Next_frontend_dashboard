import axios from "axios";

const API_URI = process.env.API_DB_URI

export const regUser = async (data) => {

    return await axios.post(`${API_URI}/api/auth/register`, data)
        .then(res => res)
        .catch(err => err.response)

}