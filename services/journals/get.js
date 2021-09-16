import axios from "axios";
import {myOptions} from "../settings";

const API_URI = process.env.API_DB_URI

export const getJournals = async (token) => {

    const options = myOptions(token)

    return await axios.get(`${API_URI}/api/journals/get-journals`, options)
}

export const getOrderJournal = async (id, token) => {

    const options = myOptions(token)

    return await axios.get(`${API_URI}/api/journals/${id}`, options)
}

