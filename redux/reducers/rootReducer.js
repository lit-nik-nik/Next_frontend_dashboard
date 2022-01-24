import {combineReducers} from "redux";
import {appReducer} from "./appReducer";
import {journalReducer} from "./journalReducer";
import {constructorReducer} from "./constructorReducer";

export const rootReducer = combineReducers({
    app: appReducer,
    journal: journalReducer,
    constructor: constructorReducer
})
