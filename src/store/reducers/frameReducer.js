/*
 * Npm Import
 */
/*
 * Local Import
 */
/*
 * Types
 */
export const FULL_SIZE = 'FULL_SIZE';
export const CLOSE_APP = 'CLOSE_APP';
export const START_APP = 'START_APP';
export const SET_ACTIVE_APP = 'SET_ACTIVE_APP';
/*
 * State
*/
const initialState = {
  // Used in frame to set the element for draggable action
  activeApp: {},
  // Used as a counter used to set up the z-index of the frames
  zIndex: 0,
  applications: {
    'text-editor': {
      appName: 'text-editor',
      title: 'Text Editor',
      fullSize: false,
      display: false,
      zIndex: 0,
    },
    task: {
      appName: 'task',
      title: 'Task',
      fullSize: false,
      display: false,
      zIndex: 0,
    },
  },
};

/*
 * Reducer
 */
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case START_APP: {
      return {
        ...state,
        applications: {
          ...state.applications,
          [action.payload]: {
            ...state.applications[action.payload],
            display: true,
          },
        },
      };
    }
    case FULL_SIZE: {
      return {
        ...state,
        applications: {
          ...state.applications,
          [action.payload]: {
            ...state.applications[action.payload],
            fullSize: !state.applications[action.payload].fullSize,
          },
        },
      };
    }
    case CLOSE_APP: {
      return {
        ...state,
        applications: {
          ...state.applications,
          [action.payload]: {
            ...state.applications[action.payload],
            display: false,
          },
        },
      };
    }
    case SET_ACTIVE_APP: {
      return {
        ...state,
        activeApp: action.payload,
        zIndex: state.zIndex + 1,
        applications: {
          ...state.applications,
          [action.payload]: {
            ...state.applications[action.payload],
            zIndex: state.zIndex + 1,
          },
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
export const startAppAction = appId => ({
  type: START_APP,
  payload: appId,
});
export const fullSizeAction = appId => ({
  type: FULL_SIZE,
  payload: appId,
});
export const closeAppAction = appId => ({
  type: CLOSE_APP,
  payload: appId,
});
export const setActiveAppAction = appId => ({
  type: SET_ACTIVE_APP,
  payload: appId,
});
/*
 * Export default
*/
export default reducer;
