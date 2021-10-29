import {myAxios, myOptions} from "../settings";

export const getJournals = async (token) => {
    return await myAxios.get(`/api/journals/get-journals`, myOptions(token))
}

export const getOrderJournal = async (id, token) => {
    if (token) {
        return await myAxios.get(`/api/journals/${id}`, myOptions(token))
    } else {
        return await myAxios.get(`/api/journals/${id}`)
    }
}

export const getAdoptedOrderJournal = async (id, token, page = 1, limit = 100, sDate = '', eDate = '', search = '') => {
    return await myAxios.get(`/api/journals/adopted/${id}?_page=${page}&_limit=${limit}&_d1=${sDate}&_d2=${eDate}&_filter=${search}`, myOptions(token))
}

export const getTransactionSalary = async (id, token) => {
    return await myAxios.get(`/api/at-order/salary-transactions/${id}`, myOptions(token))
}

export const getWeekSalary = async (id, token) => {
    return await myAxios.get(`/api/at-order/preliminary-calculation/${id}`, myOptions(token))
}

export const getTransaction = async (id, token) => {
    return await myAxios.get(`/api/at-order/salary-report/${id}`, myOptions(token))
}




