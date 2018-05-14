/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../../../../Utils/config';
import {
  CREATE_TEAM,
  createTeamSuccessAction,
  createTeamFailureAction,
  FETCH_TEAMS,
  fetchTeamsSuccessAction,
  fetchTeamsFailureAction,
  FETCH_SINGLE_TEAM,
  fetchSingleTeamSuccessAction,
  fetchSingleTeamFailureAction,
  EDIT_TEAM,
  editTeamSuccessAction,
  editTeamFailureAction,
} from '../reducers/teamReducer';

import { logoutAction } from '../../../../../store/reducers/authReducer';
/*
 * Code
 */
const toObject = (arr) => {
  let obj = {};
  arr.forEach((element) => {
    obj = { ...obj, [element[0]]: element[1].value };
  });
  return obj;
};
/*
 * Middleware
 */
export default store => next => (action) => {
  const { authReducer } = store.getState();
  switch (action.type) {
    case CREATE_TEAM: {
      const formData = action.payload;
      formData.users = [...formData.users, {
        _id: authReducer.loginProcess.loggedUser._id,
      }];
      axios({
        method: 'post',
        data: formData,
        url: `${ROOT_URL}/api/teams`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(createTeamSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.log(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(createTeamFailureAction(error.response.data.errors));
        });
      break;
    }
    case EDIT_TEAM: {
      // 1- the action.payload is the state with all fields.
      // I filter to get only those who changed
      const filteredArray = Object.entries(action.payload).filter(field => field[1].changed);
      // 2- I transform my array to an object
      const formData = toObject(filteredArray);
      axios({
        method: 'put',
        data: formData,
        url: `${ROOT_URL}/api/teams/${store.getState().teamReducer.activeTeamProcess.team._id}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(editTeamSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(editTeamFailureAction(error.response.data.errors));
        });
      break;
    }
    case FETCH_TEAMS: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/teams`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchTeamsSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(fetchTeamsFailureAction(error.response.data.errors));
        });
      break;
    }
    case FETCH_SINGLE_TEAM: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/teams/${action.projectId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchSingleTeamSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(fetchSingleTeamFailureAction(error.response.data.errors));
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
