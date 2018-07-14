/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../../../../Utils/config';
import {
  CREATE_PROJECT,
  createProjectSuccessAction,
  createProjectFailureAction,
  FETCH_PROJECTS,
  fetchProjectsSuccessAction,
  fetchProjectsFailureAction,
  FETCH_SINGLE_PROJECT,
  fetchSingleProjectSuccessAction,
  fetchSingleProjectFailureAction,
  EDIT_PROJECT,
  editProjectSuccessAction,
  editProjectFailureAction,
  DELETE_PROJECT,
} from '../reducers/projectReducer';

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
  switch (action.type) {
    case CREATE_PROJECT: {
      const formData = toObject(Object.entries(action.payload).filter(field => field));
      formData.docs = action.payload.docs;
      axios({
        method: 'post',
        data: formData,
        url: `${ROOT_URL}/api/projects`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(createProjectSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.log(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(createProjectFailureAction(error.response.data.errors));
        });
      break;
    }
    case EDIT_PROJECT: {
      // 1- the action.payload is the state with all fields.
      // I filter to get only those who changed
      const filteredArray = Object.entries(action.payload).filter(field => field[1].changed);
      // 2- I transform my array to an object
      const formData = toObject(filteredArray);
      axios({
        method: 'put',
        data: formData,
        url: `${ROOT_URL}/api/projects/${store.getState().projectReducer.activeProjectProcess.project._id}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(editProjectSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(editProjectFailureAction(error.response.data.errors));
        });
      break;
    }
    case FETCH_PROJECTS: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/projects${action.payload && action.payload.filter ? `?search=${action.payload.filter}` : ''}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchProjectsSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(fetchProjectsFailureAction(error.response.data.errors));
        });
      break;
    }
    case FETCH_SINGLE_PROJECT: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/projects/${action.projectId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchSingleProjectSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(fetchSingleProjectFailureAction(error.response.data.errors));
        });
      break;
    }
    case DELETE_PROJECT: {
      axios({
        method: 'delete',
        url: `${ROOT_URL}/api/projects/${action.projectId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          // store.dispatch(fetchSingleProjectSuccessAction(data));
          console.log('success', data)
        })
        .catch((error) => {
          if (!error.response) {
            return console.error(error);
          }
          return console.error('Error While Deleting', error);
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
