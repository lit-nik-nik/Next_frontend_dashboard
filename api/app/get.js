import {myAxios} from "../settings";

export const getReboot = async () => {
    return await myAxios.get(`/api/service/restart`)
}