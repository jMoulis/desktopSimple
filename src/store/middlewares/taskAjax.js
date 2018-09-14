/*
 * Npm import
 */
import axios from 'axios';

/*
 * Local import
 */
import { ROOT_URL } from '../../Utils/config';
import {
  CREATE_TASK,
  createTaskSuccessAction,
  createTaskFailureAction,
  FETCH_TASKS,
  fetchTasksSuccessAction,
  fetchTasksFailureAction,
  FETCH_SINGLE_TASK,
  fetchSingleTaskSuccessAction,
  fetchSingleTaskFailureAction,
  EDIT_TASK,
  editTaskSuccessAction,
  editTaskFailureAction,
  DELETE_TASK,
  deleteTaskSuccessAction,
  deleteTaskFailureAction,
  DELETE_COMMENT_TASK,
  EDIT_COMMENT_TASK,
} from '../reducers/taskReducer';
import { logoutAction } from '../reducers/authReducer';
import Utils from '../../Utils/utils';
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
 */
export default store => next => action => {
  const utils = new Utils();
  switch (action.type) {
    case CREATE_TASK: {
      const filteredArray = Object.entries(action.payload).filter(
        field => field[1].changed,
      );
      const form = toObject(filteredArray);
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append([key], form[key]));
      if (action.payload.files) {
        action.payload.files.value.forEach(file => {
          formData.append('files', file);
        });
      }
      axios({
        method: 'post',
        data: formData,
        url: `${ROOT_URL}/api/tasks`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(createTaskSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.log(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(
            createTaskFailureAction(error.response.data.errors),
          );
        });
      break;
    }
    case EDIT_TASK: {
      const taskId = store.getState().taskReducer.activeTaskProcess.task._id;
      const teamId = store.getState().mainTeamReducer.activeTeamProcess.team
        ._id;
      console.log(action.payload);
      const filteredArray = Object.entries(action.payload).filter(
        field => field[1].changed,
      );
      const form = toObject(filteredArray);
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append([key], form[key]));
      if (teamId) {
        formData.append('team', teamId);
      }
      axios({
        method: 'put',
        data: formData,
        url: `${ROOT_URL}/api/tasks/${taskId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(editTaskSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(
            editTaskFailureAction(error.response.data.errors),
          );
        });
      break;
    }
    case FETCH_TASKS: {
      const teamId = store.getState().mainTeamReducer.activeTeamProcess.team
        ._id;
      const filter = utils.buildUrlFilter(action.payload);
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/tasks?${filter}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchTasksSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(
            fetchTasksFailureAction(error.response.data.errors),
          );
        });
      break;
    }
    case FETCH_SINGLE_TASK: {
      axios({
        method: 'get',
        url: `${ROOT_URL}/api/tasks/${action.taskId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(fetchSingleTaskSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.error(error);
          }
          if (error.response.data.auth === false) {
            return store.dispatch(logoutAction());
          }
          return store.dispatch(
            fetchSingleTaskFailureAction(error.response.data.errors),
          );
        });
      break;
    }
    case DELETE_TASK: {
      axios({
        method: 'delete',
        url: `${ROOT_URL}/api/tasks/${action.taskId}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(deleteTaskSuccessAction(data));
        })
        .catch(error => {
          if (!error.response) {
            return console.error(error);
          }
          return store.dispatch(
            deleteTaskFailureAction(error.response.data.errors),
          );
        });
      break;
    }
    case EDIT_COMMENT_TASK: {
      const filteredArray = Object.entries(action.message).filter(
        field => field[1].changed,
      );
      const form = toObject(filteredArray);
      axios({
        method: 'put',
        url: `${ROOT_URL}/api/tasks/comments/${action.taskId}?comment=${
          action.commentId
        }`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        data: form,
      })
        .then(({ data }) => {
          store.dispatch(editTaskSuccessAction(data));
        })
        .catch(error => {
          return console.error(error);
        });
      break;
    }
    case DELETE_COMMENT_TASK: {
      axios({
        method: 'delete',
        url: `${ROOT_URL}/api/tasks/comments/${action.taskId}?comment=${
          action.commentId
        }`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
        .then(({ data }) => {
          store.dispatch(editTaskSuccessAction(data));
        })
        .catch(error => {
          return console.error(error);
        });
      break;
    }
    default:
  }

  // Je passe à mon voisin
  next(action);
};
