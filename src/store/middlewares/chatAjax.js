import axios from 'axios';
// import { ROOT_URL } from '../../Utils/config';
import {
  CREATE_MESSAGE,
  FETCH_MESSAGES,
  fetchMessagesSuccessAction,
  fetchMessagesFailureAction,
  FETCH_MESSAGE,
  fetchMessageSuccessAction,
  fetchMessageFailureAction,
} from '../reducers/chatReducer';
import { logoutAction } from '../reducers/authReducer';

const ROOT_URL = process.env.REACT_APP_API;
export default store => next => action => {
  switch (action.type) {
    case CREATE_MESSAGE: {
      const {
        form: { sender, message, receiver, room },
        socket,
      } = action.payload;
      // const formData = new FormData();
      socket.emit('private message', {
        sender: sender.value,
        room: room.value,
        message: message.value,
        receiver: receiver.value,
      });

      break;
    }

    case FETCH_MESSAGES: {
      const { receiver, sender, room, socket } = action.payload;
      socket.emit('FETCH_MESSAGES', {
        sender,
        room,
        receiver,
      });
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/messages?sender=${sender}&receiver=${receiver}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchMessagesSuccessAction({ ...data, room }));
        })
        .catch(error => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(
            fetchMessagesFailureAction(error.response.data.errors),
          );
        });
      break;
    }

    case FETCH_MESSAGE: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/messages`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchMessageSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(
            fetchMessageFailureAction(error.response.data.errors),
          );
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
