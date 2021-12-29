import { Action } from "../../type-scrypt/types/appTypes";
import {
    REMOVE_COMMENTS_ORDER,
    REMOVE_ORDERS, SET_COMMENTS_ORDER,
    SET_FUTURE_ORDERS,
    SET_ORDERS_SECTOR,
    SET_OVERDUE_ORDERS,
    SET_SECTORS,
    SET_TODAY_ORDERS
} from "../types/typesApp";

export const setSectors:Action = (sectors) => ({
    type: SET_SECTORS,
    payload: sectors
})

export const setOrdersSector:Action = (orders) => ({
    type: SET_ORDERS_SECTOR,
    payload: orders
})

export const setTodayOrders:Action = (orders) => ({
    type: SET_TODAY_ORDERS,
    payload: orders
})

export const setFutureOrders:Action = (orders) => ({
    type: SET_FUTURE_ORDERS,
    payload: orders
})

export const setOverdueOrders:Action = (orders) => ({
    type: SET_OVERDUE_ORDERS,
    payload: orders
})

export const removeOrders:Action = () => ({
    type: REMOVE_ORDERS
})

export const setCommentsOrder:Action = (comments) => ({
    type: SET_COMMENTS_ORDER,
    payload: comments
})

export const removeCommentsOrder:Action = () => ({
    type: REMOVE_COMMENTS_ORDER
})