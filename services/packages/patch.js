import axios from "axios";

const API_URI ='http://localhost:3100'

export const patchOrder = async (id, data) => {
    await axios.patch(`${API_URI}/orders/${id}`, data)
        .catch(err => console.error(err))
}