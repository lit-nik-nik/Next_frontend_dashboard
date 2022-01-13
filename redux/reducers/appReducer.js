import {
    ERROR,
    FULLSCREEN,
    LOADING,
    SET_TOKEN_TIMER,
    SET_USER,
    SUCCESS,
    UN_ERROR,
    UN_LOADING,
    UN_SUCCESS
} from "../types/typesApp";

const initialState = {
    loading: false,
    app_error: null,
    app_success: null,
    mainMenu: [],
    activeTimer: null,
    user: {},
    fullscreen: false
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING:
            return {...state, loading: true}
        case UN_LOADING:
            return {...state, loading: false}
        case ERROR:
            return {...state, app_error: action.payload}
        case UN_ERROR:
            return {...state, app_error: null}
        case SUCCESS:
            return {...state, app_success: action.payload}
        case UN_SUCCESS:
            return {...state, app_success: null}
        case SET_TOKEN_TIMER:
            return {...state, activeTimer: action.payload}
        case SET_USER:
            return {...state, user: action.payload}
        case FULLSCREEN:
            return {...state, fullscreen: !state.fullscreen}
        default:
            return state
    }
}