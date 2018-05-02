/*
 * Npm Import
 */
/*
 * Local Import
 */
import applications from '../../components/Applications/config/applications';
/*
 * Types
 */
export const FULL_SIZE = 'FULL_SIZE';
export const CLOSE_APP = 'CLOSE_APP';
export const START_APP = 'START_APP';
export const REDUCE_APP = 'REDUCE_APP';
export const SET_ACTIVE_APP = 'SET_ACTIVE_APP';
/*
 * State
*/
const initialState = {
  // Used in frame to set the element for draggable action
  activeApp: {
    appName: '',
    appComponent: null,
  },
  activeApps: [],
  // Used as a counter used to set up the z-index of the frames
  zIndex: 0,
  applications,
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
    case REDUCE_APP: {
      return {
        ...state,
        applications: {
          ...state.applications,
          [action.payload]: {
            ...state.applications[action.payload],
            reduce: true,
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
            fullSize: true,
          },
        },
      };
    }
    case SET_ACTIVE_APP: {
      let { activeApps } = state;
      const { payload } = action;
      if (state.activeApps.length === 0) {
        activeApps = [...state.activeApps, action.payload];
      }
      else {
        const result = activeApps.find(activeApp => activeApp.appName === payload.appName);
        if (!result) {
          activeApps = [...activeApps, payload];
        }
      }
      return {
        ...state,
        activeApp: action.payload,
        zIndex: state.zIndex + 1,
        applications: {
          ...state.applications,
          [action.payload.appName]: {
            ...state.applications[action.payload.appName],
            zIndex: state.zIndex + 1,
            reduce: false,
          },
        },
        activeApps,
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
export const setActiveAppAction = app => ({
  type: SET_ACTIVE_APP,
  payload: app,
});
export const reduceAppAction = app => ({
  type: REDUCE_APP,
  payload: app,
});
/*
 * Export default
*/
export default reducer;
