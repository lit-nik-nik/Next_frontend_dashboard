import Router from "next/router";


export default function exitApp () {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')

    Router.push('/auth')
}