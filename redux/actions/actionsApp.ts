import { Action } from "../../type-scrypt/types/appTypes";
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
