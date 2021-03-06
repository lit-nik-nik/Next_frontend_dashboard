import axios from "axios";
import Cookies from 'js-cookie'

const API_URI = process.env.API_DB_URI
const token = Cookies.get('token') ? Cookies.get('token') : ''

export const myAxios = axios.create(
    {
        baseURL: API_URI,
        timeout: 60000,
        headers: {
            'Authorization': token
        }
    }
)

export const connectAxios = axios.create(
    {
        baseURL: API_URI,
        headers: {
            'Authorization': token
        }
    }
)

export const myOptions = (token) => {
    return {
        headers: {
            'Authorization': token
        }
    }
}