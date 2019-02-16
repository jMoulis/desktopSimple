import axios from 'axios';
import {
  FETCH_MESSAGES,
  fetchMessagesSuccessAction,
  UPDATE_MESSAGE,
  updateMessageSuccessAction,
  DELETE_MESSAGE,
  deleteMessageSuccessAction,
} from '../reducers/messageReducer';

const ROOT_URL = process.env.REACT_APP_API;

export default store => next => action => {
  switch (action.type) {
    case FETCH_MESSAGES: {
      const { roomId, limit } = action.payload;
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/messages/room/${roomId}${
          limit ? `?limit=${limit.limit}` : ''
        }`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchMessagesSuccessAction(data));
        })
        .catch(error => {
          console.error(error.message);
        });
      break;
    }
    case UPDATE_MESSAGE: {
      const { messageId, values } = action.payload;
      axios({
        method: 'put',
        url: `${ROOT_URL}/api/messages/${messageId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        data: values,
      })
        .then(({ data }) => {
          store.dispatch(updateMessageSuccessAction(data));
        })
        .catch(error => {
          console.error(error.message);
        });
      break;
    }
    case DELETE_MESSAGE: {
      const { messageId, values } = action.payload;
      axios({
        method: 'delete',
        url: `${ROOT_URL}/api/messages/${messageId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        data: values,
      })
        .then(({ data }) => {
          store.dispatch(deleteMessageSuccessAction(data));
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
