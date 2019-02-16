import axios from 'axios';
import {
  FETCH_NOTIFICATIONS,
  fetchNotificationsSuccessAction,
  UPDATE_NOTIFICATIONS,
} from '../reducers/notificationsReducer';

const ROOT_URL = process.env.REACT_APP_API;

export default store => next => action => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/notifications`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchNotificationsSuccessAction(data));
        })
        .catch(error => {
          console.error(error.message);
        });
      break;
    }
    case UPDATE_NOTIFICATIONS: {
      axios({
        method: 'put',
        url: `${ROOT_URL}/api/notifications`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        data: {
          sender: action.payload.sender,
          type: action.payload.type,
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchNotificationsSuccessAction(data));
        })
        .catch(error => {
          console.error(error.message);
        });
      break;
    }
    default:
  }

  next(action);
};
