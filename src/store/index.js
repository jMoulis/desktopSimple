import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

import appReducer from './reducers/appReducer';
import frameReducer from './reducers/frameReducer';
import authReducer from './reducers/authReducer';
import taskReducer from './reducers/taskReducer';
import userReducer from './reducers/userReducer';
import mainTeamReducer from './reducers/teamReducer';
import fileReducer from './reducers/fileReducer';
import projectReducer from '../components/Applications/Projects/store/reducers/projectReducer';
import teamReducer from '../components/Applications/Projects/store/reducers/teamReducer';
import chatReducer from './reducers/chatReducer';
import notificationsReducer from './reducers/notificationsReducer';

import authAjax from './middlewares/authAjax';
import userAjax from './middlewares/userAjax';
import taskAjax from './middlewares/taskAjax';
import mainTeamAjax from './middlewares/teamAjax';
import fileAjax from './middlewares/fileAjax';
import projectAjax from '../components/Applications/Projects/store/middlewares/projectAjax';
import chatAjax from './middlewares/chatAjax';
import notificationsAjax from './middlewares/notificationsAjax';
import teamAjax from '../components/Applications/Projects/store/middlewares/teamAjax';

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
  fileReducer,
  notificationsReducer,
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
    applyMiddleware(fileAjax),
    applyMiddleware(notificationsAjax),
    ...devTools,
  ),
);

/*
 * Export default
*/
export default store;
