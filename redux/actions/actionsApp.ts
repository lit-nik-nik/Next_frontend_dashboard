import Router from "next/router";
import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie'
import {
    ERROR,
    FULLSCREEN,
    LOADING, SET_MAIN_MENU,
    SET_TOKEN_TIMER,
    SET_USER,
    SET_USERS,
    SUCCESS,
    UN_ERROR,
    UN_LOADING,
    UN_SUCCESS
} from "../types/typesApp";
import {AuthAPI} from "../../api/authApi";
import {getJournals} from "../../api/journals/get";
import {addMenu} from "../../modules/menu/add-menu";
import {changeKeyboard} from "../../modules/change-keyboard";
import { Action } from "../../type-scrypt/types/appTypes";

export const setUser:Action = (user) => ({type: SET_USER, payload: user})
export const setUsers:Action = (users) => ({type: SET_USERS, payload: users})

export const setLoading:Action = () => ({type: LOADING})
export const removeLoading:Action = () => ({type: UN_LOADING})

export const setFullscreen:Action = () => ({type: FULLSCREEN})

export const setError:Action = (payload) => ({type: ERROR, payload: payload})
export const removeError:Action = () => ({type: UN_ERROR})

export const success:Action = (payload) => ({type: SUCCESS, payload: payload})
export const unSuccess:Action = () => ({type: UN_SUCCESS})

export const setTokenTimer:Action = (timerId) => ({type: SET_TOKEN_TIMER, payload: timerId})

export const setMainMenu:Action = (menu) => ({type: SET_MAIN_MENU, payload: menu})

export const getUsers = () => {
    return (dispatch) => {
        dispatch(setLoading())

        AuthAPI.getUsers()
            .then(data => {
                dispatch(removeLoading())
                dispatch(setUsers(data.lists.employers))
            })
            .catch(() => {
                dispatch(setUsers([]))
            })
    }
}

export const authUser = (login) => {
    const {user, pass, barcode} = login,
        redirect = () => Router.push('/')

    let newBarcode = changeKeyboard(barcode)

    let salt = bcrypt.genSaltSync(10),
        hash = null

    if (pass) {
        hash = bcrypt.hashSync(pass, salt)
    }

    return (dispatch) => {
        dispatch(setLoading())

        AuthAPI.authUser(user, hash, newBarcode)
            .then(res => {
                if (res.status === 200) {
                    Cookies.set('token', res.data.token, {expires: 10 / 24})
                    Cookies.set('userId', res.data.userId, {expires: 10 / 24})
                    localStorage.setItem('user', JSON.stringify(res.data.user))
                    dispatch(setUser(res.data.user))

                    getJournals(res.data.token)
                        .then(result => {
                            dispatch(setMainMenu(addMenu(result.data.journals)))
                        })
                        .catch(err => dispatch(setError(err.response?.data)))

                    dispatch(removeLoading())
                    setTimeout(redirect, 1000)
                } else {
                    dispatch(setError(res.data))
                }
            })
            .catch(err => dispatch(setError(err.response?.data)))
    }

}