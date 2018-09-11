/*
 * Npm Import
 */

/*
 * Local Import
 */
/*
 * Types
 */
export const FETCH_SINGLE_PROJECT = 'FETCH_SINGLE_PROJECT';
export const FETCH_SINGLE_PROJECT_SUCCESS = 'FETCH_SINGLE_PROJECT_SUCCESS';
export const FETCH_SINGLE_PROJECT_FAILURE = 'FETCH_SINGLE_PROJECT_FAILURE';

export const FETCH_PROJECTS = 'FETCH_PROJECTS';
export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS';
export const FETCH_PROJECTS_FAILURE = 'FETCH_PROJECTS_FAILURE';

export const CREATE_PROJECT = 'CREATE_PROJECT';
export const CREATE_PROJECT_SUCCESS = 'CREATE_PROJECT_SUCCESS';
export const CREATE_PROJECT_FAILURE = 'CREATE_PROJECT_FAILURE';

export const EDIT_PROJECT = 'EDIT_PROJECT';
export const EDIT_PROJECT_SUCCESS = 'EDIT_PROJECT_SUCCESS';
export const EDIT_PROJECT_FAILURE = 'EDIT_PROJECT_FAILURE';

export const DELETE_PROJECT = 'DELETE_PROJECT';
export const DELETE_PROJECT_SUCCESS = 'DELETE_PROJECT_SUCCESS';
export const DELETE_PROJECT_FAILURE = 'DELETE_PROJECT_FAILURE';

export const CLEAR_PROJECT_MESSAGE = 'CLEAR_PROJECT_MESSAGE';

/*
 * State
*/
const initialState = {
  projectCreation: {
    project: {},
    success: null,
    loading: true,
    error: null,
  },
  projectListProcess: {
    projects: [],
    success: null,
    loading: true,
    error: null,
  },
  activeProjectProcess: {
    project: {},
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
    case CREATE_PROJECT: {
      return {
        ...state,
        projectCreation: {
          project: {},
          loading: true,
          error: null,
          success: null,
        },
      };
    }
    case CREATE_PROJECT_SUCCESS: {
      return {
        ...state,
        projectCreation: {
          project: action.payload.project,
          loading: false,
          error: null,
          success: action.payload.success,
        },
        projectListProcess: {
          ...state.projectListProcess,
          error: null,
          projects: [
            action.payload.project,
            ...state.projectListProcess.projects,
          ],
        },
      };
    }
    case CREATE_PROJECT_FAILURE: {
      return {
        ...state,
        projectCreation: {
          project: {},
          loading: false,
          error: action.payload,
          success: null,
        },
      };
    }
    case FETCH_PROJECTS: {
      return {
        ...state,
        projectListProcess: {
          projects: [],
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_PROJECTS_SUCCESS: {
      return {
        ...state,
        projectListProcess: {
          projects: action.payload.projects,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case FETCH_PROJECTS_FAILURE: {
      return {
        ...state,
        projectListProcess: {
          projects: [],
          success: null,
          loading: false,
          error: action.payload.error,
        },
      };
    }
    case FETCH_SINGLE_PROJECT: {
      return {
        ...state,
        activeProjectProcess: {
          project: {},
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_SINGLE_PROJECT_SUCCESS: {
      return {
        ...state,
        activeProjectProcess: {
          project: action.payload.project,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case FETCH_SINGLE_PROJECT_FAILURE: {
      return {
        ...state,
        activeProjectProcess: {
          project: {},
          success: null,
          loading: false,
          error: action.payload.error,
        },
      };
    }
    case EDIT_PROJECT: {
      return {
        ...state,
      };
    }
    case EDIT_PROJECT_SUCCESS: {
      /**
       * The response is only the field modify
       */
      const { id } = action.payload.project;
      const { projects } = state.projectListProcess;
      // Update the project in the projects list
      // to update the projects list page
      const projectsUpdated = projects.map(project => {
        if (project._id === id) {
          return {
            ...project,
          };
        }
        return project;
      });
      return {
        ...state,
        activeProjectProcess: {
          project: action.payload.project,
          loading: false,
          error: null,
          success: action.payload.success,
        },
        projectListProcess: {
          projects: projectsUpdated,
          success: null,
          loading: false,
          error: null,
        },
      };
    }
    case EDIT_PROJECT_FAILURE: {
      return {
        ...state,
        activeProjectProcess: {
          ...state.activeProjectProcess,
          loading: false,
          error: action.payload,
        },
      };
    }
    case DELETE_PROJECT: {
      const { projects } = state.projectListProcess;
      // Update the project in the projects list
      // to update the projects list page
      const projectsUpdated = projects.filter(
        project => project._id !== action.projectId,
      );
      return {
        ...state,
        activeProjectProcess: {
          project: {},
          loading: false,
          error: null,
        },
        projectListProcess: {
          projects: projectsUpdated,
          success: null,
          loading: false,
          error: null,
        },
      };
    }
    case CLEAR_PROJECT_MESSAGE: {
      return {
        ...state,
        projectCreation: {
          project: {},
          success: null,
          loading: true,
          error: null,
        },
        activeProjectProcess: {
          ...state.activeProjectProcess,
          loading: false,
          error: null,
          success: null,
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

export const fetchSingleProjectAction = projectId => ({
  type: FETCH_SINGLE_PROJECT,
  projectId,
});
export const fetchSingleProjectSuccessAction = data => ({
  type: FETCH_SINGLE_PROJECT_SUCCESS,
  payload: data,
});
export const fetchSingleProjectFailureAction = error => ({
  type: FETCH_SINGLE_PROJECT_FAILURE,
  payload: error,
});
export const fetchProjectsAction = filter => ({
  type: FETCH_PROJECTS,
  payload: filter,
});
export const fetchProjectsSuccessAction = data => ({
  type: FETCH_PROJECTS_SUCCESS,
  payload: data,
});
export const fetchProjectsFailureAction = error => ({
  type: FETCH_PROJECTS_FAILURE,
  payload: error,
});
export const editProjectAction = updates => ({
  type: EDIT_PROJECT,
  payload: updates,
});
export const editProjectSuccessAction = data => ({
  type: EDIT_PROJECT_SUCCESS,
  payload: data,
});
export const editProjectFailureAction = error => ({
  type: EDIT_PROJECT_FAILURE,
  payload: error,
});
export const createProjectAction = values => ({
  type: CREATE_PROJECT,
  payload: values,
});
export const createProjectSuccessAction = data => ({
  type: CREATE_PROJECT_SUCCESS,
  payload: data,
});
export const createProjectFailureAction = error => ({
  type: CREATE_PROJECT_FAILURE,
  payload: error,
});
export const clearProjectMessageAction = () => ({
  type: CLEAR_PROJECT_MESSAGE,
});
export const deleteProjectAction = projectId => ({
  type: DELETE_PROJECT,
  projectId,
});
/*
 * Export default
*/
export default reducer;
