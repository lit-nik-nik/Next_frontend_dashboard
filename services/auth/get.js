import axios from "axios";

const API_URI =' http://192.168.2.10:3131'

export const getUsers = async () => {
    let users;

    await axios.get(`${API_URI}/lists`)
        .then(res  => users = res.data.lists.employers)

    return users
}