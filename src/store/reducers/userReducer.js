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

export const FETCH_USERS_COUNT = 'FETCH_USERS_COUNT';
export const FETCH_USERS_COUNT_SUCCESS = 'FETCH_USERS_COUNT_SUCCESS';

export const EDIT_USER = 'EDIT_USER';
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS';
export const EDIT_USER_FAILURE = 'EDIT_USER_FAILURE';

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
  editUser: {
    user: {},
    editing: false,
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
    case EDIT_USER: {
      return {
        ...state,
      };
    }
    case EDIT_USER_SUCCESS: {
      const newUsers = state.userList.users.map((user) => {
        if (user.id === action.payload.id) {
          return {
            ...user,
            ...action.payload.updates,
          };
        }
        return user;
      });
      return {
        ...state,
        userList: {
          ...state.userList,
          users: newUsers,
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
