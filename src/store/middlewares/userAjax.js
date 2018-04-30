/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../Utils/config';
import {
  FETCH_USERS,
  fetchUsersSuccessAction,
  fetchUsersFailureAction,
} from '../reducers/userReducer';
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
        url: `${ROOT_URL}/api/users`,
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
    default:
  }

  // Je passe à mon voisin
  next(action);
};
