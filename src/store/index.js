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
import taskReducer from './reducers/taskReducer';
import userReducer from './reducers/userReducer';
import mainTeamReducer from './reducers/teamReducer';
import projectReducer from '../components/Applications/Projects/store/reducers/projectReducer';
import teamReducer from '../components/Applications/Projects/store/reducers/teamReducer';
import chatReducer from '../components/Applications/Chat/store/reducers/chatReducer';

// MIDDLEWARES
import authAjax from './middlewares/authAjax';
import userAjax from './middlewares/userAjax';
import taskAjax from './middlewares/taskAjax';
import mainTeamAjax from './middlewares/teamAjax';
import projectAjax from '../components/Applications/Projects/store/middlewares/projectAjax';
import chatAjax from '../components/Applications/Chat/store/middleswares/chatAjax';
import teamAjax from '../components/Applications/Projects/store/middlewares/teamAjax';

/*
 * Code
*/

// Redux DevTools extension
let devTools = [];
if (window.devToolsExtension) {
  devTools = [window.devToolsExtension()];
}
const mainReducer = combineReducers({
  appReducer,
  frameReducer,
  authReducer,
  projectReducer,
  userReducer,
  teamReducer,
  mainTeamReducer,
  chatReducer,
  taskReducer,
});

// Reset reducer on logout
const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return mainReducer(state, action);
};

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(authAjax),
    applyMiddleware(userAjax),
    applyMiddleware(projectAjax),
    applyMiddleware(teamAjax),
    applyMiddleware(mainTeamAjax),
    applyMiddleware(chatAjax),
    applyMiddleware(taskAjax),
    ...devTools,
  ),
);

/*
 * Export default
*/
export default store;
