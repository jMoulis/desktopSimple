/*
 * Npm Import
 */

/*
 * Local Import
 */
/*
 * Types
 */
export const FETCH_SINGLE_TASK = 'FETCH_SINGLE_TASK';
export const FETCH_SINGLE_TASK_SUCCESS = 'FETCH_SINGLE_TASK_SUCCESS';
export const FETCH_SINGLE_TASK_FAILURE = 'FETCH_SINGLE_TASK_FAILURE';

export const FETCH_TASKS = 'FETCH_TASKS';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';

export const CREATE_TASK = 'CREATE_TASK';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE';

export const EDIT_TASK = 'EDIT_TASK';
export const EDIT_TASK_SUCCESS = 'EDIT_TASK_SUCCESS';
export const EDIT_TASK_FAILURE = 'EDIT_TASK_FAILURE';

export const DELETE_TASK = 'DELETE_TASK';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILURE = 'DELETE_TASK_FAILURE';

export const CLEAR_TASK_MESSAGE = 'CLEAR_TASK_MESSAGE';

/*
 * State
*/
const initialState = {
  taskCreation: {
    task: {},
    success: null,
    loading: true,
    error: null,
  },
  taskListProcess: {
    tasks: [],
    success: null,
    loading: true,
    error: null,
  },
  activeTaskProcess: {
    task: {},
    success: null,
    loading: true,
    error: null,
  },
};

/*
 * Reducer
 */
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case CREATE_TASK: {
      return {
        ...state,
        taskCreation: {
          task: {},
          loading: true,
          error: null,
          success: null,
        },
      };
    }
    case CREATE_TASK_SUCCESS: {
      return {
        ...state,
        taskCreation: {
          task: action.payload.task,
          loading: false,
          error: null,
          success: action.payload.success,
        },
      };
    }
    case CREATE_TASK_FAILURE: {
      return {
        ...state,
        taskCreation: {
          task: {},
          loading: false,
          error: action.payload,
          success: null,
        },
      };
    }
    case FETCH_TASKS: {
      return {
        ...state,
        taskListProcess: {
          tasks: [],
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_TASKS_SUCCESS: {
      return {
        ...state,
        taskListProcess: {
          tasks: action.payload.tasks,
          success: action.payload.success,
          loading: false,
          error: null,
        },
        activeTaskProcess: {
          task: action.payload.tasks && action.payload.tasks[0],
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_TASKS_FAILURE: {
      return {
        ...state,
        taskListProcess: {
          tasks: [],
          success: null,
          loading: false,
          error: action.payload.error,
        },
      };
    }
    case FETCH_SINGLE_TASK: {
      return {
        ...state,
        activeTaskProcess: {
          task: {},
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_SINGLE_TASK_SUCCESS: {
      return {
        ...state,
        activeTaskProcess: {
          task: action.payload.task,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case FETCH_SINGLE_TASK_FAILURE: {
      return {
        ...state,
        activeTaskProcess: {
          task: {},
          success: null,
          loading: false,
          error: action.payload.error,
        },
      };
    }
    case EDIT_TASK: {
      return {
        ...state,
      };
    }
    case EDIT_TASK_SUCCESS: {
      return {
        ...state,
        activeTaskProcess: {
          task: action.payload.task,
          success: null,
          loading: false,
          error: null,
        },
      };
    }
    case EDIT_TASK_FAILURE: {
      return {
        ...state,
        activeTaskProcess: {
          ...state.activeTaskProcess,
          loading: false,
          error: action.payload,
        },
      };
    }
    case DELETE_TASK: {
      return {
        ...state,
      };
    }
    case DELETE_TASK_SUCCESS: {
      return {
        ...state,
        activeTaskProcess: {
          task: {},
          success: null,
          loading: false,
          error: null,
        },
        taskListProcess: {
          tasks: action.payload.tasks,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case DELETE_TASK_FAILURE: {
      return {
        ...state,
        activeTaskProcess: {
          ...state.activeTaskProcess,
          loading: false,
          error: action.payload,
        },
      };
    }
    case CLEAR_TASK_MESSAGE: {
      return {
        ...state,
        taskCreation: {
          task: {},
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    default:
      return {
        ...state,
      };
  }
};

/*
 *Action creators
 */

export const fetchSingleTaskAction = taskId => ({
  type: FETCH_SINGLE_TASK,
  taskId,
});
export const fetchSingleTaskSuccessAction = data => ({
  type: FETCH_SINGLE_TASK_SUCCESS,
  payload: data,
});
export const fetchSingleTaskFailureAction = error => ({
  type: FETCH_SINGLE_TASK_FAILURE,
  payload: error,
});
export const fetchTasksAction = id => ({
  type: FETCH_TASKS,
  id,
});
export const fetchTasksSuccessAction = data => ({
  type: FETCH_TASKS_SUCCESS,
  payload: data,
});
export const fetchTasksFailureAction = error => ({
  type: FETCH_TASKS_FAILURE,
  payload: error,
});
export const editTaskAction = updates => ({
  type: EDIT_TASK,
  payload: updates,
});
export const editTaskSuccessAction = data => ({
  type: EDIT_TASK_SUCCESS,
  payload: data,
});
export const editTaskFailureAction = error => ({
  type: EDIT_TASK_FAILURE,
  payload: error,
});
export const createTaskAction = values => ({
  type: CREATE_TASK,
  payload: values,
});
export const createTaskSuccessAction = data => ({
  type: CREATE_TASK_SUCCESS,
  payload: data,
});
export const createTaskFailureAction = error => ({
  type: CREATE_TASK_FAILURE,
  payload: error,
});
export const clearTaskMessageAction = () => ({
  type: CLEAR_TASK_MESSAGE,
});
export const deleteTaskAction = TASKId => ({
  type: DELETE_TASK,
  TASKId,
});
export const deleteTaskSuccessAction = data => ({
  type: DELETE_TASK_SUCCESS,
  payload: data,
});
export const deleteTaskFailureAction = error => ({
  type: DELETE_TASK_FAILURE,
  payload: error,
});
/*
 * Export default
*/
export default reducer;
