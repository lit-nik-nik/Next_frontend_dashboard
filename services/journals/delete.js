import {myAxios, myOptions} from "../settings";

export const deleteCommentOrder = async (id, token) => {
    return await myAxios.delete(`/api/extra-data/comments/delete/${id}`, myOptions(token))
}