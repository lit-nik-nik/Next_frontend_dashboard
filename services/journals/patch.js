import {myAxios, myOptions} from "../settings";

export const patchTransaction = async (token, data) => {
    return await myAxios.patch(`/api/at-order/close-billing-period`, data, myOptions(token))
}

export const patchCommentOrder = async (data, token) => {
    return await myAxios.patch(`/api/extra-data/comments/edit`, data, myOptions(token))
}