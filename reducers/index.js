import {combineReducers} from "redux";

import RepoReducer from './reducer';

const rootReducer = combineReducers({
    repo: RepoReducer
});

export default rootReducer;
