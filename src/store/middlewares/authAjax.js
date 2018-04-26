/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../Utils/config';
import Auth from '../../Utils/auth';
import {
  LOGIN,
  loginSuccessAction,
  loginFailureAction,
} from '../reducers/authReducer';

/*
 * Code
 */

/*
 * Middleware
 */
export default store => next => (action) => {
  switch (action.type) {
    case LOGIN: {
      const url = `${ROOT_URL}/api/login`;
      axios({
        method: 'post',
        url,
        data: action.payload,
      })
        .then(({ data }) => {
          const auth = new Auth(data.token);
          const decodedToken = auth.decodeToken();
          store.dispatch(loginSuccessAction(decodedToken));
        })
        .catch((data) => {
          store.dispatch(loginFailureAction(data.response.data.errors));
          localStorage.removeItem('token');
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
