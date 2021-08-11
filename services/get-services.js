import axios from "axios";

const API_URI =' http://localhost:3100'


export const getAllOrder = async () => {
    let data;

    await axios.get(`${API_URI}/orders?_sort=ORDER_ID&_order=desc`)
    .then(res  => data = res.data)

    return {
        props: { data }
    }
}

export const getTotalCountOrders = async () => {
    let totalCount

    await axios.get(`${API_URI}/orders?_limit=1`)
    .then(res  => totalCount = res.headers['x-total-count'])

    return {
        props: { totalCount }
    }
}

export const getPageOrder = async (page, limit) => {
    let data

    await axios.get(`${API_URI}/orders?_sort=ORDER_ID&_order=desc&_page=${page}&_limit=${limit}`)
    .then(res  => data = {
        orders: res.data,
        totalCount: res.headers['x-total-count'],
        acitvePage: page,
    })

    return {
        props : {
            data
        }
    }
}

export const getOrder = async (id) => {
    let order;

    await axios.get(`${API_URI}/orders/${id}`)
    .then(res  =>  order = res.data)

    return {
        props: { order }
    }
}