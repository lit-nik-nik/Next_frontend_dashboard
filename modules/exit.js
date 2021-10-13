import Router from "next/router";
import Cookies from 'js-cookie'


export default function exitApp () {
    const redirect = () => Router.push('/auth')

    Cookies.remove('token')
    Cookies.remove('userId')
    Cookies.remove('userName')

    setTimeout(redirect, 2000)
}