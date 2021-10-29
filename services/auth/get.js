import {myAxios} from "../settings";

export const getUsers = async () => {

    return await myAxios.get(`/lists`)

}

