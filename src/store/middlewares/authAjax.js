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
  EDIT_USER,
  editUserSuccessAction,
  editUserFailureAction,
  DELETE_USER,
  deleteUserFailureAction,
  CHANGE_PASSWORD,
  changePasswordSuccessAction,
  changePasswordFailureAction,
  logoutAction,
} from '../reducers/authReducer';
import { fetchUserSuccessAction } from '../reducers/userReducer';
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
/*
 * Middleware
 * 
 */
export default store => next => action => {
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
          const { user } = payload;
          localStorage.setItem(
            'user',
            JSON.stringify({
              _id: user._id,
              fullName: user.fullName,
            }),
          );
          store.dispatch(
            createUserSuccessAction({
              user: payload.user,
              auth: decodedToken.auth,
            }),
          );
          store.dispatch(
            loginSuccessAction({ user: payload.user, auth: decodedToken.auth }),
          );
        })
        .catch(data => {
          if (!data.response) {
            return console.error(data);
          }
          return store.dispatch(
            createUserFailureAction(data.response.data.errors),
          );
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
        .then(({ data }) => {
          const payload = data;
          const auth = new Auth(payload.token);
          const { user } = payload;

          auth.saveLocalStorage();
          const decodedToken = auth.decodeToken();
          localStorage.setItem(
            'user',
            JSON.stringify({
              _id: user._id,
              fullName: user.fullName,
            }),
          );
          store.dispatch(fetchUserSuccessAction(payload));
          store.dispatch(loginSuccessAction({ user, auth: decodedToken.auth }));
        })
        .catch(error => {
          if (!error.response) {
            if (error.message === 'Network Error') {
              store.dispatch(
                loginFailureAction({
                  login: {
                    status: 500,
                    detail: 'Serveur Error, contact customer services',
                  },
                  auth: false,
                }),
              );
            }
          } else {
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
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          reject(new Error(JSON.stringify({ auth: false })));
        }
      });

      rehydrate
        .then(({ user, auth }) => {
          axios({
            method: 'get',
            url: `${ROOT_URL}/api/users/${user._id}`,
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            },
          })
            .then(({ data }) => {
              localStorage.setItem(
                'user',
                JSON.stringify({
                  _id: data.user._id,
                  fullName: data.user.fullName,
                }),
              );
              setTimeout(() => {
                store.dispatch(fetchUserSuccessAction(data));
                store.dispatch(
                  rehydrateSuccessAction({ user: data.user, auth }),
                );
              }, 300);
            })
            .catch(error => {
              if (error.errors) {
                store.dispatch(rehydrateFailureAction(error.errors.error));
              }
            });
        })
        .catch(error => console.log(error));
      break;
    }
    case EDIT_USER: {
      let formData = {};
      const hasCompanyProperty = Object.prototype.hasOwnProperty.call(
        action.payload,
        'company',
      );
      if (hasCompanyProperty) {
        formData = {
          company: toObject(
            Object.entries(action.payload.company).filter(
              field => field[1].changed,
            ),
          ),
        };
      } else {
        formData = toObject(
          Object.entries(action.payload).filter(field => field[1].changed),
        );
      }
      axios({
        method: 'put',
        data: { ...formData },
        url: `${ROOT_URL}/api/users/${action.id}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(editUserSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.error(error);
          }
          return store.dispatch(
            editUserFailureAction(error.response.data.errors),
          );
        });
      break;
    }

    case CHANGE_PASSWORD: {
      axios({
        method: 'post',
        data: { id: action.id, ...action.payload },
        url: `${ROOT_URL}/api/security`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(changePasswordSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.log(error.message);
          }
          return store.dispatch(
            changePasswordFailureAction(error.response.data.errors),
          );
        });
      break;
    }
    case DELETE_USER: {
      axios({
        method: 'delete',
        url: `${ROOT_URL}/api/users/${action.userId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(() => {
          store.dispatch(logoutAction());
        })
        .catch(error => {
          console.error(error);
          if (!error.response) {
            return console.log(error.message);
          }
          return store.dispatch(
            deleteUserFailureAction(error.response.data.errors),
          );
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
