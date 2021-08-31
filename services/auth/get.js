import axios from "axios";

const API_URI = process.env.API_DB_URI

export const getUsers = async () => {
    let users;

    await axios.get(`${API_URI}/lists`)
        .then(res  => users = res.data.lists.employers)

    return users
}

