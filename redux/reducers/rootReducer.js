import {combineReducers} from "redux";
import {appReducer} from "./appReducer";
import {journalReducer} from "./journalReducer";

export const rootReducer = combineReducers({
    app: appReducer,
    journal: journalReducer
})
