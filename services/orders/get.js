import axios from "axios";

const API_URI =' http://192.168.2.10:3131'


export const getAllOrders = async () => {
    let data;

    await axios.get(`${API_URI}/orders`)
        .then(res  => data = res.data)

    return {
        props: { data }
    }
}

export const getOrder = async (id) => {
    let order;

    await axios.get(`${API_URI}/orders/${id}`)
        .then(res  =>  order = res.data.order)

    return {
        props: { order }
    }
}