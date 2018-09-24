import axios from 'axios';
import {
  FETCH_ROOM,
  fetchRoomSuccessAction,
  fetchRoomFailureAction,
  FETCH_ROOMS,
  fetchRoomsSuccessAction,
  fetchRoomsFailureAction,
} from '../reducers/chatReducer';

const ROOT_URL = process.env.REACT_APP_API;

export default store => next => action => {
  switch (action.type) {
    case FETCH_ROOM: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/rooms/${action.payload}/messages`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchRoomSuccessAction(data));
        })
        .catch(error => {
          store.dispatch(fetchRoomFailureAction(error.response));
        });
      break;
    }
    case FETCH_ROOMS: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/rooms/?type=${action.payload}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchRoomsSuccessAction(data));
        })
        .catch(error => {
          store.dispatch(fetchRoomsFailureAction(error.response));
        });
      break;
    }
    default:
  }

  next(action);
};
