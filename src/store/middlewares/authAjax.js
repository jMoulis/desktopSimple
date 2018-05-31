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
import { fetchUserSuccessAction } from '../reducers/userReducer';
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
          const payload = data;
          const auth = new Auth(data.token);
          auth.saveLocalStorage();
          const decodedToken = auth.decodeToken();
          localStorage.setItem('user', JSON.stringify(payload.user));
          store.dispatch(createUserSuccessAction({ user: payload.user, auth: decodedToken.auth }));
          store.dispatch(loginSuccessAction({ user: payload.user, auth: decodedToken.auth }));
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
      const { email, password } = action.payload;
      axios({
        method: 'post',
        url,
        data: { email: email.value, password: password.value },
      })
        .then((data) => {
          const payload = data.data;
          const auth = new Auth(payload.token);
          const { user } = payload;
          auth.saveLocalStorage();
          const decodedToken = auth.decodeToken();
          localStorage.setItem('user', JSON.stringify({
            _id: user._id,
            fullName: user.fullName,
          }));
          store.dispatch(fetchUserSuccessAction(user));
          store.dispatch(loginSuccessAction({ user: payload.user, auth: decodedToken.auth }));
        })
        .catch((error) => {
          if (!error.response) {
            console.error(error.message);
            if (error.message === 'Network Error') {
              store.dispatch(loginFailureAction({
                login: {
                  status: 500,
                  detail: 'Serveur Error, contact customer services',
                },
                auth: false,
              }));
            }
          }
          else {
            store.dispatch(loginFailureAction(error.response.data.errors));
            localStorage.removeItem('token');
          }
        });
      break;
    }
    case REHYDRATE: {
      const rehydrate = new Promise((resolve, reject) => {
        const token = localStorage.getItem('token');
        const auth = new Auth(token);
        const decodedToken = auth.decodeToken();
        if ('auth' in decodedToken) {
          const user = JSON.parse(localStorage.getItem('user'));
          resolve({ user, auth: decodedToken.auth });
        }
        else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          reject(new Error(JSON.stringify({ auth: false })));
        }
      });
      rehydrate
        .then(({ user, auth }) => {
          const handleErrors = (response) => {
            if (!response.ok) {
              response.json()
                .then((error) => {
                  store.dispatch(rehydrateFailureAction(error));
                  return error;
                });
              throw new Error('Auth error');
            }
            return response;
          };

          fetch(`${ROOT_URL}/api/users/${user._id}`, {
            method: 'get',
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            },
          })
            .then(handleErrors)
            .then(response => response.json())
            .then((userUpdated) => {
              localStorage.setItem('user', JSON.stringify({
                _id: userUpdated._id,
                fullName: userUpdated.fullName,
              }));
              setTimeout(() => {
                store.dispatch(fetchUserSuccessAction(userUpdated));
                store.dispatch(rehydrateSuccessAction({ user: userUpdated, auth }));
              }, 300);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.log(error));
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
