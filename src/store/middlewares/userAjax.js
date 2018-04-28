/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../Utils/config';
import {
  FETCH_SINGLE_USER,
  fetchSingleUserSuccessAction,
  fetchSingleUserFailureAction,
  FETCH_USERS,
  fetchUsersSuccessAction,
  fetchUsersFailureAction,
  EDIT_USER,
  editUserSuccessAction,
  editUserFailureAction,
} from '../reducers/userReducer';
/*
 * Code
 */

/*
 * Middleware
 */
export default store => next => (action) => {
  switch (action.type) {
    // case FETCH_SINGLE_USER:
    //   axios({
    //     method: 'get',
    //     url: `${ROOT_URL}/api/users/${action.id}`,
    //     headers: {
    //       Authorization: localStorage.getItem('token'),
    //     },
    //   })
    //     .then(({ data }) => {
    //       store.dispatch(fetchSingleUserSuccessAction(data));
    //     })
    //     .catch(({ response }) => {
    //       store.dispatch(fetchSingleUserFailureAction(response.statusText));
    //     });
    //   break;
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
    // case EDIT_USER: {
    //   const formData = new FormData(action.payload);
    //   formData.append('id', action.id);
    //   axios({
    //     method: 'put',
    //     data: formData,
    //     url: `${ROOT_URL}/api/users/${action.id}`,
    //     headers: {
    //       Authorization: localStorage.getItem('token'),
    //     },
    //   })
    //     .then(({ data }) => {
    //       store.dispatch(editUserSuccessAction(data));
    //     })
    //     .catch((err) => {
    //       console.error(err)
    //       //store.dispatch(editUserFailureAction(response.status));
    //     });
    //   break;
    // }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
