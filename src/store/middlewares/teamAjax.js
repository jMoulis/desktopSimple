/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../Utils/config';
import {
  GLOBAL_CREATE_TEAM,
  createTeamSuccessAction,
  createTeamFailureAction,
  GLOBAL_FETCH_TEAMS,
  fetchTeamsSuccessAction,
  fetchTeamsFailureAction,
  GLOBAL_FETCH_SINGLE_TEAM,
  fetchSingleTeamSuccessAction,
  fetchSingleTeamFailureAction,
  GLOBAL_EDIT_TEAM,
  editTeamSuccessAction,
  editTeamFailureAction,
  GLOBAL_DELETE_TEAM,
  deleteTeamSuccessAction,
  deleteTeamFailureAction,
} from '../reducers/teamReducer';
import { logoutAction, editUserSuccessAction } from '../reducers/authReducer';
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
  switch (action.type) {
    case GLOBAL_CREATE_TEAM: {
      const formData = action.payload;
      formData.users = [...formData.users];
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
    case GLOBAL_EDIT_TEAM: {
      const filteredArray = Object.entries(action.payload).filter(field => field[1].changed);
      const formData = toObject(filteredArray);
      formData.users = action.payload.users;
      axios({
        method: 'put',
        data: formData,
        url: `${ROOT_URL}/api/teams/${store.getState().mainTeamReducer.activeTeamProcess.team._id}`,
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
    case GLOBAL_FETCH_TEAMS: {
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
    case GLOBAL_FETCH_SINGLE_TEAM: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/teams/${action.teamId}`,
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
    case GLOBAL_DELETE_TEAM: {
      axios({
        method: 'delete',
        url: `${ROOT_URL}/api/teams/${action.teamId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(deleteTeamSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.error(error);
          }
          return store.dispatch(deleteTeamFailureAction(error.response.data.errors));
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
