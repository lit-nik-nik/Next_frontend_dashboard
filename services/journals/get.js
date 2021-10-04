import axios from "axios";
import {myOptions} from "../settings";

const API_URI = process.env.API_DB_URI

export const getJournals = async (token) => {
    return await axios.get(`${API_URI}/api/journals/get-journals`, myOptions(token))
}

export const getOrderJournal = async (id, token) => {
    return await axios.get(`${API_URI}/api/journals/${id}`, myOptions(token))
}

export const getAdoptedOrderJournal = async (id, token, page = 1, limit = 100, sDate = '', eDate = '', search = '') => {
    return await axios.get(`${API_URI}/api/journals/adopted/${id}?_page=${page}&_limit=${limit}&_d1=${sDate}&_d2=${eDate}&_filter=${search}`, myOptions(token))
}

export const getTransactionSalary = async (id, token) => {
    return await axios.get(`${API_URI}/api/at-order/salary-transactions/${id}`, myOptions(token))
}

export const getWeekSalary = async (id, token) => {
    return await axios.get(`${API_URI}/api/at-order/preliminary-calculation/${id}`, myOptions(token))
}

export const getTransaction = async (id, token) => {
    return await axios.get(`${API_URI}/api/at-order/salary-report/${id}`, myOptions(token))
}




