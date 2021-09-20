import Router from "next/router";
import Cookies from 'js-cookie'


export default function exitApp () {
    Cookies.remove('token')
    Cookies.remove('userId')

    Router.push('/auth')
}