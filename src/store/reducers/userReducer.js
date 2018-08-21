/*
 * Npm Import
 */

/*
 * Local Import
 */
/*
 * Types
 */
export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const FETCH_USERS_COUNT = 'FETCH_USERS_COUNT';
export const FETCH_USERS_COUNT_SUCCESS = 'FETCH_USERS_COUNT_SUCCESS';

export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
/*
 * State
*/
const initialState = {
  userList: {
    users: [],
    loading: false,
    error: null,
    page: {},
  },
  userActive: {
    user: {},
    loading: true,
    error: null,
  },
  usersCount: {},
};

/*
 * Reducer
 */
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_USERS: {
      return {
        ...state,
        userList: {
          users: [],
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_USERS_SUCCESS: {
      return {
        ...state,
        userList: {
          users: action.payload.users,
          loading: false,
          error: null,
          pagination: action.payload.pagination,
        },
      };
    }
    case FETCH_USERS_FAILURE: {
      return {
        ...state,
        userList: {
          users: [],
          loading: false,
          error: action.payload,
        },
      };
    }
    case FETCH_USERS_COUNT: {
      return {
        ...state,
      };
    }
    case FETCH_USERS_COUNT_SUCCESS: {
      return {
        ...state,
        usersCount: action.payload,
      };
    }
    case FETCH_USER: {
      return {
        ...state,
        userActive: {
          user: {},
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_USER_SUCCESS: {
      return {
        ...state,
        userActive: {
          user: action.payload.user,
          loading: false,
          error: null,
        },
      };
    }
    case FETCH_USER_FAILURE: {
      return {
        ...state,
        userActive: {
          user: {},
          loading: false,
          error: action.payload,
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
        editUser: {
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

export const fetchUsersCountAction = filter => ({
  type: FETCH_USERS_COUNT,
  payload: filter,
});
export const fetchUsersCountSuccessAction = count => ({
  type: FETCH_USERS_COUNT_SUCCESS,
  payload: count,
});
export const fetchUsersAction = filter => ({
  type: FETCH_USERS,
  payload: filter,
});
export const fetchUsersSuccessAction = data => ({
  type: FETCH_USERS_SUCCESS,
  payload: data,
});
export const fetchUsersFailureAction = error => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});
export const fetchUserAction = userId => ({
  type: FETCH_USER,
  userId,
});
export const fetchUserSuccessAction = data => ({
  type: FETCH_USER_SUCCESS,
  payload: data,
});
export const fetchUserFailureAction = error => ({
  type: FETCH_USER_FAILURE,
  payload: error,
});
export const clearMessageAction = () => ({
  type: CLEAR_MESSAGE,
});
/*
 * Export default
*/
export default reducer;
