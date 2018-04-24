/*
 * Npm import
*/
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

/*
 * Local Import
*/
import appReducer from './reducers/appReducer';
import frameReducer from './reducers/frameReducer';

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
});

const store = createStore(
  rootReducer,
  compose(
    ...devTools,
  ),
);

/*
 * Export default
*/
export default store;