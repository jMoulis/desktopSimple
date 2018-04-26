/*
 * Npm Import
 */

/*
 * Local Import
 */
/*
 * Types
 */
export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const FETCH_SINGLE_USER = 'FETCH_SINGLE_USER';
export const FETCH_SINGLE_USER_SUCCESS = 'FETCH_SINGLE_USER_SUCCESS';
export const FETCH_SINGLE_USER_FAILURE = 'FETCH_SINGLE_USER_FAILURE';

export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

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
  },
  userActive: {
    user: {},
    loading: true,
    error: null,
  },
  loggedUser: {
    user: {},
    loading: false,
    error: null,
  },
  createUser: {
    user: {},
    creating: false,
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
    case CREATE_USER: {
      return {
        ...state,
        createUser: {
          user: {},
          creating: true,
          error: null,
        },
      };
    }
    case CREATE_USER_SUCCESS: {
      return {
        ...state,
        userList: {
          ...state.userList,
          users: [
            ...state.userList.users,
            action.payload,
          ],
        },
      };
    }
    case CREATE_USER_FAILURE: {
      return {
        ...state,
        createUser: {
          user: {},
          creating: false,
          error: action.payload,
        },
      };
    }
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
          users: action.payload,
          loading: false,
          error: null,
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
export const createUserAction = formValues => ({
  type: CREATE_USER,
  payload: formValues,
});
export const createUserSuccessAction = data => ({
  type: CREATE_USER_SUCCESS,
  payload: data,
});
export const createUserFailureAction = error => ({
  type: CREATE_USER_FAILURE,
  payload: error,
});
export const fetchUsersAction = () => ({
  type: FETCH_USERS,
});
export const fetchUsersSuccessAction = data => ({
  type: FETCH_USERS_SUCCESS,
  payload: data,
});
export const fetchUsersFailureAction = error => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});
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
