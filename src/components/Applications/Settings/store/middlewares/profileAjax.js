/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../../../../Utils/config';
import {
  FETCH_SINGLE_USER,
  fetchSingleUserSuccessAction,
  fetchSingleUserFailureAction,
  EDIT_USER,
  editUserSuccessAction,
  editUserFailureAction,
} from '../reducers/settingsReducer';
/*
 * Code
 */
const toObject = arr => ({ [arr[0]]: arr[1].value });
/*
 * Middleware
 */
export default store => next => (action) => {
  switch (action.type) {
    case FETCH_SINGLE_USER:
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/users/${action.id}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchSingleUserSuccessAction(data));
        })
        .catch((data) => {
          if (!data.response) {
            return console.log(data);
          }
          return store.dispatch(fetchSingleUserFailureAction(data.response.data.errors));
        });
      break;
    case EDIT_USER: {
      // 1- the action.payload is the state with all fields.
      // I filter to get only those who changed
      const filteredArray = Object.entries(action.payload).filter(field => field[1].changed);
      // 2- I transform my array to an object
      const formData = toObject(filteredArray[0]);

      axios({
        method: 'put',
        data: { id: action.id, ...formData },
        url: `${ROOT_URL}/api/users/${action.id}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(editUserSuccessAction(data));
          const user = {
            id: data._id,
            picture: data.picture,
          };
          localStorage.setItem('user', JSON.stringify(user));
        })
        .catch(({ response }) => {
          // console.error(err)
          store.dispatch(editUserFailureAction(response.data.errors));
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
