import axios from 'axios';

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
  SEND_FRIEND_REQUEST,
  sendFriendRequestSuccessAction,
} from '../reducers/userReducer';
import { logoutAction } from '../reducers/authReducer';
import Utils from '../../Utils/utils';

export default store => next => action => {
  const utils = new Utils();
  switch (action.type) {
    case FETCH_USERS: {
      const filter = utils.buildUrlFilter(action.payload);
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/users?${filter}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchUsersSuccessAction(data));
        })
        .catch(({ response }) => {
          store.dispatch(fetchUsersFailureAction(response.data.errors.error));
        });
      break;
    }

    case FETCH_USER:
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/users/${action.userId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
          type: 'user',
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchUserSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.log(error);
          }
          if (error.response.status === 500) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(
            fetchUserFailureAction(error.response.error.errors),
          );
        });
      break;

    case FETCH_USERS_COUNT: {
      const filter = utils.buildUrlFilter(action.payload);
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/users?${filter}`,
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
    }
    case SEND_FRIEND_REQUEST: {
      axios({
        method: 'put',
        url: `${ROOT_URL}/api/friendrequest`,
        data: { ...action.payload },
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(sendFriendRequestSuccessAction(data));
        })
        .catch(({ response }) => {
          console.error(response.statusText);
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
