import {myAxios, myOptions} from "../settings";
import {ExtraData} from "../../type-scrypt/types/journalsTypes";

export const getJournals = async (token) => {
    return await myAxios.get(`/api/journals/get-journals`, myOptions(token))
}

export const getOrderJournal = async (id, filter, token) => {
    let journal,
        allJournal = {
            id: 100,
            name: 'Все участки',
            overdue: [],
            forToday: [],
            forFuture: []
        },
        page = '', limit = '', sDate = '', eDate = ''

    await myAxios.get(`/api/journals/${id}?_page=${page}&_limit=${limit}&_d1=${sDate}&_d2=${eDate}&_filter=${filter}`, myOptions(token))
        .then(res => journal = res.data.journal)

    if (journal.length > 1) {
        journal.map(plot => {
            allJournal.overdue.push(...plot.overdue)
            allJournal.forToday.push(...plot.forToday)
            allJournal.forFuture.push(...plot.forFuture)
        })

        journal = [...journal, allJournal]
    }

    return journal
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

export const getSectors = async (token, id) => {
    return await myAxios.get(`/api/journals/get-sectors?_id=${id}`, myOptions(token))
}

export const getOrdersSector = async (token: string, id: number, idSector: number, filter: string = '', search?:string) => {
    let page = '', limit = '', sDate = '', eDate = ''

    return await myAxios.get(`api/journals/plan-orders?_id=${id}&_idsector=${idSector}&_page=${page}&_limit=${limit}&_d1=${sDate}&_d2=${eDate}&_filter=${filter}`, myOptions(token))
}

export const getCommentsOrder = async (token: string, id: number) => {
    return await myAxios.get(`/api/extra-data/comments/order/${id}`, myOptions(token))
}







