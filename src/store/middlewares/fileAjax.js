/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../Utils/config';

import {
  FETCH_FILE,
  fetchFileSuccessAction,
  fetchFileFailureAction,
} from '../reducers/fileReducer';

export default store => next => action => {
  switch (action.type) {
    case FETCH_FILE: {
      axios({
        method: 'get',
        url: `${ROOT_URL}${action.payload}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchFileSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.error(error);
          }
          return store.dispatch(
            fetchFileFailureAction(error.response.data.errors),
          );
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
