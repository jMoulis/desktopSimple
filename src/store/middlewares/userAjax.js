/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../Utils/config';
import {
  FETCH_USER,
  fetchUserSuccessAction,
  fetchUserFailureAction,
  FETCH_USERS,
  fetchUsersSuccessAction,
  fetchUsersFailureAction,
  FETCH_USERS_COUNT,
  fetchUsersCountSuccessAction,
} from '../reducers/userReducer';
import { logoutAction } from '../reducers/authReducer';
/*
 * Code
 */

/*
 * Middleware
 */
export default store => next => (action) => {
  switch (action.type) {
    case FETCH_USERS:
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/users?filter=${action.payload}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchUsersSuccessAction(data));
        })
        .catch(({ response }) => {
          store.dispatch(fetchUsersFailureAction(response.statusText));
        });
      break;
    case FETCH_USER:
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/users/${action.userId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchUserSuccessAction(data));
        })
        .catch((error) => {
          if (!error.response) {
            return console.log(error);
          }
          if (error.response.status === 500) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(fetchUserFailureAction(error.response.error.errors));
        });
      break;
    case FETCH_USERS_COUNT:
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/users?filter=${action.payload}&count=true`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchUsersCountSuccessAction(data));
        })
        .catch(({ response }) => {
          console.error(response.statusText);
        });
      break;
    default:
  }

  // Je passe à mon voisin
  next(action);
};
