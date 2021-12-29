import {
    REMOVE_COMMENTS_ORDER,
    REMOVE_ORDERS, SET_COMMENTS_ORDER,
    SET_FUTURE_ORDERS,
    SET_ORDERS_SECTOR,
    SET_OVERDUE_ORDERS,
    SET_SECTORS,
    SET_TODAY_ORDERS
} from "../types/typesApp";

const initialState = {
    sectors: [],
    orders: [],
    todayOrders: [],
    overdueOrders: [],
    futureOrders: [],
    comments: []
}

export const journalReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ORDERS_SECTOR:
            return {...state, orders: action.payload}
        case SET_SECTORS:
            return {...state, sectors: action.payload}
        case SET_TODAY_ORDERS:
            return {...state, todayOrders: action.payload}
        case SET_FUTURE_ORDERS:
            return {...state, futureOrders: action.payload}
        case SET_OVERDUE_ORDERS:
            return {...state, overdueOrders: action.payload}
        case REMOVE_ORDERS:
            return {...state, orders: [], todayOrders: [], overdueOrders: [], futureOrders: []}
        case SET_COMMENTS_ORDER:
            return {...state, comments: action.payload}
        case REMOVE_COMMENTS_ORDER:
            return {...state, comments: []}
        default:
            return state
    }
}