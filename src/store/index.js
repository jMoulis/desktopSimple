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
import userReducer from './reducers/userReducer';

// MIDDLEWARES
import authAjax from './middlewares/authAjax';

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
  userReducer,
});

const store = createStore(
  rootReducer,
  compose(applyMiddleware(authAjax), ...devTools),
);

/*
 * Export default
*/
export default store;
