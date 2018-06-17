/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../../../../Utils/config';
import {
  FETCH_SINGLE_USER,
  fetchSingleUserSuccessAction,
  fetchSingleUserFailureAction,
  CHANGE_PASSWORD,
  changePasswordSuccessAction,
  changePasswordFailureAction,
  DELETE_USER,
  deleteUserSuccessAction,
  deleteUserFailureAction,
} from '../reducers/profileReducer';
import { logoutAction } from '../../../../../store/reducers/authReducer';
/*
 * Code
 */

/*
 * Middleware
 */
export default store => next => (action) => {
  switch (action.type) {
    case FETCH_SINGLE_USER:
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/users/${action.id}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchSingleUserSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.log(error);
          }
          return store.dispatch(fetchSingleUserFailureAction(error.response.error.errors));
        });
      break;
    case CHANGE_PASSWORD: {
      axios({
        method: 'post',
        data: { id: action.id, ...action.payload },
        url: `${ROOT_URL}/api/security`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(changePasswordSuccessAction(data));
        })
        .catch((error) => {
          // console.error(err)
          if (!error.response) {
            return console.log(error.message);
          }
          return store.dispatch(changePasswordFailureAction(error.response.data.errors));
        });
      break;
    }
    case DELETE_USER: {
      axios({
        method: 'delete',
        url: `${ROOT_URL}/api/users/${action.userId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(deleteUserSuccessAction(data));
          store.dispatch(logoutAction());
        })
        .catch((error) => {
          // console.error(err)
          if (!error.response) {
            return console.log(error.message);
          }
          return store.dispatch(deleteUserFailureAction(error.response.data.errors));
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
