import axios from 'axios';
import io from 'socket.io-client';
import { ROOT_URL } from '../../Utils/config';
import {
  CREATE_MESSAGE,
  CREATE_MESSAGE_SUCCESS,
  createMessageSuccessAction,
  createMessageFailureAction,
  FETCH_MESSAGES,
  fetchMessagesSuccessAction,
  fetchMessagesFailureAction,
  FETCH_MESSAGE,
  fetchMessageSuccessAction,
  fetchMessageFailureAction,
} from '../reducers/chatReducer';
import { logoutAction } from '../reducers/authReducer';
/*
 * Code
 */
const toObject = arr => {
  let obj = {};
  arr.forEach(element => {
    obj = { ...obj, [element[0]]: element[1].value };
  });
  return obj;
};

export default store => next => action => {
  switch (action.type) {
    case CREATE_MESSAGE: {
      const {
        form: { sender, message, receiver, room },
        socket,
      } = action.payload;
      const filteredArray = Object.entries(action.payload).filter(
        field => field[1].changed,
      );
      const form = toObject(filteredArray);
      // const formData = new FormData();
      socket.emit('private message', {
        sender: sender.value,
        room: room.value,
        message: message.value,
        receiver: receiver.value,
      });
      // Object.keys(form).forEach(key => formData.append([key], form[key]));
      // axios({
      //   method: 'post',
      //   data: form,
      //   url: `${ROOT_URL}/api/messages`,
      //   headers: {
      //     Authorization: localStorage.getItem('token'),
      //   },
      // })
      //   .then(({ data }) => {
      //     store.dispatch(createMessageSuccessAction(data));
      //   })
      //   .catch(error => {
      //     if (!error.response) {
      //       return console.log(error);
      //     }
      //     return store.dispatch(
      //       createMessageFailureAction(error.response.data.errors),
      //     );
      //   });
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
