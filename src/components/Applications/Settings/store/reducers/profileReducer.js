/*
 * Npm Import
 */

/*
 * Local Import
 */
/*
 * Types
 */
export const FETCH_SINGLE_USER = 'FETCH_SINGLE_USER';
export const FETCH_SINGLE_USER_SUCCESS = 'FETCH_SINGLE_USER_SUCCESS';
export const FETCH_SINGLE_USER_FAILURE = 'FETCH_SINGLE_USER_FAILURE';

export const EDIT_USER = 'EDIT_USER';
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS';
export const EDIT_USER_FAILURE = 'EDIT_USER_FAILURE';

export const DELETE_USER = 'DELETE_USER';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE';

export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

/*
 * State
*/
const initialState = {
  userActive: {
    user: {},
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
    case FETCH_SINGLE_USER: {
      return {
        ...state,
        userActive: {
          user: {},
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_SINGLE_USER_SUCCESS: {
      return {
        ...state,
        userActive: {
          user: action.payload,
          loading: false,
          error: null,
          success: null,
        },
      };
    }
    case FETCH_SINGLE_USER_FAILURE: {
      return {
        ...state,
        userActive: {
          user: {},
          loading: false,
          error: action.payload,
          success: null,
        },
      };
    }
    case EDIT_USER: {
      return {
        ...state,
      };
    }
    case EDIT_USER_SUCCESS: {
      return {
        ...state,
        userActive: {
          user: action.payload.user,
          loading: false,
          error: null,
        },
      };
    }
    case EDIT_USER_FAILURE: {
      return {
        ...state,
        userActive: {
          ...state.userActive,
          loading: false,
          error: action.payload,
        },
      };
    }
    case CHANGE_PASSWORD: {
      return {
        ...state,
        userActive: {
          ...state.userActive,
          loading: false,
          error: null,
        },
      };
    }
    case CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        userActive: {
          ...state.userActive,
          loading: false,
          error: null,
          success: action.payload.success,
        },
      };
    }
    case CHANGE_PASSWORD_FAILURE: {
      return {
        ...state,
        userActive: {
          ...state.userActive,
          loading: false,
          error: action.payload,
        },
      };
    }
    case DELETE_USER: {
      return {
        ...state,
        userActive: {
          ...state.userActive,
          loading: true,
          error: null,
        },
      };
    }
    case DELETE_USER_SUCCESS: {
      return {
        ...state,
        userActive: {
          user: {},
          success: null,
          loading: false,
          error: null,
        },
      };
    }
    case DELETE_USER_FAILURE: {
      return {
        ...state,
        userActive: {
          ...state.userActive,
          loading: false,
          error: action.payload.error,
          success: null,
        },
      };
    }
    case CLEAR_MESSAGE: {
      return {
        ...state,
        userActive: {
          ...state.userActive,
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

export const fetchSingleUserAction = id => ({
  type: FETCH_SINGLE_USER,
  id,
});
export const fetchSingleUserSuccessAction = data => ({
  type: FETCH_SINGLE_USER_SUCCESS,
  payload: data,
});
export const fetchSingleUserFailureAction = error => ({
  type: FETCH_SINGLE_USER_FAILURE,
  payload: error,
});
export const editUserAction = (id, updates) => ({
  type: EDIT_USER,
  id,
  payload: updates,
});
export const editUserSuccessAction = data => ({
  type: EDIT_USER_SUCCESS,
  payload: data,
});
export const editUserFailureAction = error => ({
  type: EDIT_USER_FAILURE,
  payload: error,
});
export const changePasswordAction = (id, updates) => ({
  type: CHANGE_PASSWORD,
  id,
  payload: updates,
});
export const changePasswordSuccessAction = data => ({
  type: CHANGE_PASSWORD_SUCCESS,
  payload: data,
});
export const changePasswordFailureAction = error => ({
  type: CHANGE_PASSWORD_FAILURE,
  payload: error,
});
export const deleteUserAction = userId => ({
  type: DELETE_USER,
  userId,
});
export const deleteUserSuccessAction = response => ({
  type: DELETE_USER_SUCCESS,
  payload: response,
});
export const deleteUserFailureAction = error => ({
  type: DELETE_USER_FAILURE,
  payload: error,
});
export const clearMessageAction = () => ({
  type: CLEAR_MESSAGE,
});
/*
 * Export default
*/
export default reducer;
