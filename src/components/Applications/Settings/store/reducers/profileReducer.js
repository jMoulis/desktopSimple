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

/*
 * State
*/
const initialState = {
  userActive: {
    user: {},
    loading: true,
    error: null,
  },
  editUser: {
    user: {},
    editing: false,
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
          ...state.userActive,
          user: action.payload,
        },
      };
    }
    case EDIT_USER_FAILURE: {
      return {
        ...state,
        createUser: {
          user: {},
          creating: false,
          error: action.payload,
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
/*
 * Export default
*/
export default reducer;
