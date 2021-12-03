import Router from "next/router";
import Cookies from 'js-cookie'

export default function exitApp () {
    const redirect = () => Router.push('/auth')

    Cookies.set('token', '')
    Cookies.set('userId', '')

    setTimeout(redirect, 2000)
}