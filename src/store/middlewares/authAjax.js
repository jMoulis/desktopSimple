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
  CREATE_USER,
  createUserSuccessAction,
  createUserFailureAction,
  LOGIN,
  loginSuccessAction,
  loginFailureAction,
  REHYDRATE,
  rehydrateSuccessAction,
  rehydrateFailureAction,
} from '../reducers/authReducer';
/*
 * Code
 */

/*
 * Middleware
 */
export default store => next => (action) => {
  switch (action.type) {
    case CREATE_USER: {
      const formData = new FormData(action.payload);
      axios({
        method: 'post',
        data: formData,
        url: `${ROOT_URL}/api/register`,
      })
        .then(({ data }) => {
          const auth = new Auth(data.token);
          auth.saveLocalStorage();
          const decodedToken = auth.decodeToken();
          store.dispatch(createUserSuccessAction(decodedToken));
        })
        .catch((data) => {
          if (!data.response) {
            return console.error(data);
          }
          return store.dispatch(createUserFailureAction(data.response.data.errors));
        });
      break;
    }
    case LOGIN: {
      const url = `${ROOT_URL}/api/login`;
      axios({
        method: 'post',
        url,
        data: action.payload,
      })
        .then(({ data }) => {
          const auth = new Auth(data.token);
          auth.saveLocalStorage();
          const decodedToken = auth.decodeToken();
          store.dispatch(loginSuccessAction(decodedToken));
        })
        .catch((data) => {
          store.dispatch(loginFailureAction(data.response.data.errors));
          localStorage.removeItem('token');
        });
      break;
    }
    case REHYDRATE: {
      const rehydrate = new Promise((resolve, reject) => {
        const token = localStorage.getItem('token');
        const auth = new Auth(token);
        const payload = auth.decodeToken();
        if ('user' in payload && 'auth' in payload) {
          resolve(payload);
        }
        else {
          localStorage.removeItem('token');
          reject(new Error(JSON.stringify({ auth: false })));
        }
      });
      rehydrate
        .then(payload => store.dispatch(rehydrateSuccessAction(payload)))
        .catch(({ message }) => store.dispatch(rehydrateFailureAction(JSON.parse(message))));
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
