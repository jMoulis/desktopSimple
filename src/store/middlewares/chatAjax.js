import axios from 'axios';
import {
  FETCH_ROOM,
  fetchRoomSuccessAction,
  fetchRoomFailureAction,
  FETCH_ROOMS,
  fetchRoomsSuccessAction,
  fetchRoomsFailureAction,
  FETCH_ROOMS_UPDATE_STATUS,
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
        url: `${ROOT_URL}/api/rooms`,
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
    case FETCH_ROOMS_UPDATE_STATUS: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/rooms/user/${action.payload.loggedUserId}/room/${
          action.payload.roomId
        }?updatestatus=${action.payload.status}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchRoomsSuccessAction(data));
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
