import axios from "axios";
import {myOptions} from "../settings";

const API_URI = process.env.API_DB_URI

export const patchTransaction = async (token, data) => {
    return await axios.patch(`${API_URI}/api/at-order/close-billing-period`, data, myOptions(token))
}