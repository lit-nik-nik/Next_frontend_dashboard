import {myAxios, myOptions} from "../settings";

export const patchTransaction = async (token, data) => {
    return await myAxios.patch(`/api/at-order/close-billing-period`, data, myOptions(token))
}