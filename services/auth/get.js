import axios from "axios";

const API_URI = process.env.API_DB_URI

export const getUsers = async () => {

    return await axios.get(`${API_URI}/lists`)

}

