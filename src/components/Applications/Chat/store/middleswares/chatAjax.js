/*
 * Npm import
 */
import axios from 'axios';
/*
 * Local import
 */
import { ROOT_URL } from '../../../../../Utils/config';
import { FETCH_CHAT, fetchChatSuccessAction } from '../reducers/chatReducer';
/*
 * Code
 */

/*
 * Middleware
 */
export default store => next => (action) => {
  switch (action.type) {
    case FETCH_CHAT: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/chat`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(() => {
          store.dispatch(fetchChatSuccessAction({ chat: true }));
        })
        .catch(error => console.log(error));
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
