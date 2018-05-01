/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../../../../Utils/config';
import {
  CREATE_PROJECT,
  createProjectSuccessAction,
  createProjectFailureAction,
  FETCH_PROJECTS,
  fetchProjectsSuccessAction,
  fetchProjectsFailureAction,
  EDIT_PROJECT,
  editProjectSuccessAction,
  editProjectFailureAction,
} from '../reducers/projectReducer';
/*
 * Code
 */
const toObject = (arr) => {
  let obj = {};
  arr.forEach((element) => {
    obj = { ...obj, [element[0]]: element[1].value }
  });
  return obj;
};
/*
 * Middleware
 */
export default store => next => (action) => {
  switch (action.type) {
    case CREATE_PROJECT: {
      const { loggedUser } = store.getState().authReducer.loginProcess;
      const formData = toObject(Object.entries(action.payload).filter(field => field));
      // const formData = {
      //   title: 'Test Project',
      //   description: 'qsqds adqaaze eaze',
      //   dueDate: '12/12/2015',
      //   spec: 'sdfsdfsdf',
      //   isContest: true,
      //   isPrice: true,
      //   maxTeam: 3,
      //   price: 'iPhone',
      //   status: '',
      //   needs: ['php', 'nodeJS'],
      //   createdAt: '12/12/2015',
      //   updatedAt: '12/12/2015',
      //   company: loggedUser.id,
      //   teams: [],
      // };
      axios({
        method: 'post',
        data: formData,
        url: `${ROOT_URL}/api/projects`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(createProjectSuccessAction(data));
        })
        .catch((data) => {
          if (!data.response) {
            return console.log(data);
          }
          return store.dispatch(createProjectFailureAction(data.response.data.errors));
        });
      break;
    }
    case EDIT_PROJECT: {
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
          store.dispatch(editProjectSuccessAction(data));
          const user = {
            id: data.user._id,
            picture: data.user.picture,
          };
          localStorage.setItem('user', JSON.stringify(user));
        })
        .catch(({ response }) => {
          // console.error(err)
          store.dispatch(editProjectFailureAction(response.data.errors));
        });
      break;
    }
    case FETCH_PROJECTS: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/projects`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchProjectsSuccessAction(data));
        })
        .catch(({ response }) => {
          // console.error(err)
          store.dispatch(fetchProjectsFailureAction(response.data.errors));
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
