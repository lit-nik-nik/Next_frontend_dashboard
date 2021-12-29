import {myAxios, myOptions} from "../settings";

export const postCommentOrder = async (data, token) => {
    return await myAxios.post(`/api/journals/set-comment`, data, myOptions(token))
}