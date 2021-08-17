import axios from "axios";

const API_URI =' http://192.168.2.10:3131'


export const getAllOrders = async () => {
    let data;

    await axios.get(`${API_URI}/packages`)
        .then(res  => data = res.data.data)

    return {
        props: { data }
    }
}