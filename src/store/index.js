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
import teamReducer from '../components/Applications/Projects/store/reducers/teamReducer';
import chatReducer from '../components/Applications/Chat/store/reducers/chatReducer';
import mainTeamReducer from './reducers/teamReducer';
import userReducer from './reducers/userReducer';

// MIDDLEWARES
import authAjax from './middlewares/authAjax';
import userAjax from './middlewares/userAjax';
import profileAjax from '../components/Applications/Settings/store/middlewares/profileAjax';
import projectAjax from '../components/Applications/Projects/store/middlewares/projectAjax';
import chatAjax from '../components/Applications/Chat/store/middleswares/chatAjax';
import teamAjax from '../components/Applications/Projects/store/middlewares/teamAjax';
import mainTeamAjax from './middlewares/teamAjax';

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
    ...devTools,
  ),
);

/*
 * Export default
*/
export default store;
