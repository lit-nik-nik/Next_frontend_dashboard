import {SET_TEST} from "../types/typesApp";

const initialState = {
    test: false
}

export const constructorReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TEST:
            return {...state, test: !state.test}
        default:
            return state
    }
}