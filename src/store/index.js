/*
 * Npm import
*/
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

/*
 * Local Import
*/
// REDUCERS
import appReducer from './reducers/appReducer';
import frameReducer from './reducers/frameReducer';
import authReducer from './reducers/authReducer';
import profileReducer from '../components/Applications/Settings/store/reducers/profileReducer';
import projectReducer from '../components/Applications/Projects/store/reducers/projectReducer';

// MIDDLEWARES
import authAjax from './middlewares/authAjax';
import userAjax from './middlewares/userAjax';
import profileAjax from '../components/Applications/Settings/store/middlewares/profileAjax';
import projectAjax from '../components/Applications/Projects/store/middlewares/projectAjax';

/*
 * Code
*/


// Redux DevTools extension
let devTools = [];
if (window.devToolsExtension) {
  devTools = [window.devToolsExtension()];
}
const rootReducer = combineReducers({
  appReducer,
  frameReducer,
  authReducer,
  profileReducer,
  projectReducer,
});

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(authAjax),
    applyMiddleware(userAjax),
    applyMiddleware(profileAjax),
    applyMiddleware(projectAjax),
    ...devTools,
  ),
);

/*
 * Export default
*/
export default store;
