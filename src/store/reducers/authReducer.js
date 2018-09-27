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

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REHYDRATE = 'REHYDRATE';
export const REHYDRATE_SUCCESS = 'REHYDRATE_SUCCESS';
export const REHYDRATE_FAILURE = 'REHYDRATE_FAILURE';

export const EDIT_USER = 'EDIT_USER';
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS';
export const EDIT_USER_FAILURE = 'EDIT_USER_FAILURE';

export const DELETE_USER = 'DELETE_USER';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE';

export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
export const LOGOUT = 'LOGOUT';

export const HIDE_PRIVATE_ROOM = 'HIDE_PRIVATE_ROOM';
export const HIDE_PRIVATE_ROOM_SUCCESS = 'HIDE_PRIVATE_ROOM_SUCCESS';
/*
 * State
*/
const initialState = {
  auth: false,
  loginForm: {
    display: false,
  },
  loginProcess: {
    loggedUser: null,
    logging: false,
    error: null,
    loading: false,
  },
  editUser: {
    editing: false,
    error: null,
    success: false,
  },
  createUserProcess: {
    creating: false,
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
        createUserProcess: {
          creating: true,
          error: null,
        },
      };
    }
    case CREATE_USER_SUCCESS: {
      return {
        ...state,
        createUserProcess: {
          creating: true,
          error: null,
        },
      };
    }
    case CREATE_USER_FAILURE: {
      return {
        ...state,
        createUserProcess: {
          creating: false,
          error: action.payload,
        },
      };
    }
    case LOGIN: {
      return {
        ...state,
        loginProcess: {
          loggedUser: null,
          logging: true,
          error: null,
          loading: true,
        },
        auth: false,
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        loginProcess: {
          loggedUser: action.payload.user,
          logging: false,
          error: null,
          loading: false,
        },
        auth: action.payload.auth,
      };
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        loginProcess: {
          loggedUser: {},
          logging: false,
          error: action.payload,
        },
        auth: action.payload.auth,
      };
    }
    case REHYDRATE: {
      return {
        ...state,
        loginProcess: {
          loggedUser: null,
          error: null,
        },
        auth: false,
      };
    }
    case REHYDRATE_SUCCESS: {
      return {
        ...state,
        loginProcess: {
          loggedUser: action.payload.user,
          logging: false,
          error: null,
          loading: false,
        },
        auth: action.payload.auth,
      };
    }
    case REHYDRATE_FAILURE: {
      return {
        ...state,
        loginProcess: {
          loggedUser: null,
          logging: false,
          error: action.payload,
        },
        auth: action.payload.auth,
      };
    }
    case LOGOUT: {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        loginProcess: {
          loggedUser: {},
          logging: false,
          error: null,
        },
        auth: false,
      };
    }
    case EDIT_USER: {
      return {
        ...state,
        editUser: {
          editing: true,
          error: null,
          success: false,
        },
      };
    }
    case EDIT_USER_SUCCESS: {
      return {
        ...state,
        loginProcess: {
          ...state.loginProcess,
          loggedUser: action.payload.user,
        },
        editUser: {
          editing: false,
          success: action.payload.success,
        },
      };
    }
    case EDIT_USER_FAILURE: {
      return {
        ...state,
        editUser: {
          editing: false,
          success: false,
          error: action.payload,
        },
      };
    }
    case CHANGE_PASSWORD: {
      return {
        ...state,
        editUser: {
          editing: true,
          error: null,
        },
      };
    }
    case CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        editUser: {
          editing: false,
          error: null,
        },
      };
    }
    case CHANGE_PASSWORD_FAILURE: {
      return {
        ...state,
        editUser: {
          editing: false,
          error: action.payload,
        },
      };
    }
    case DELETE_USER: {
      return {
        ...state,
        editUser: {
          editing: true,
          error: null,
        },
      };
    }
    case DELETE_USER_FAILURE: {
      return {
        ...state,
        editUser: {
          editing: true,
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
        loginProcess: {
          ...state.loginProcess,
          error: null,
        },
        createUserProcess: {
          creating: false,
          error: null,
        },
      };
    }
    case HIDE_PRIVATE_ROOM: {
      return {
        ...state,
      };
    }
    case HIDE_PRIVATE_ROOM_SUCCESS: {
      return {
        ...state,
        loginProcess: {
          ...state.loginProcess,
          loggedUser: {
            ...state.loginProcess.loggedUser,
            rooms: action.payload.rooms,
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
export const loginAction = formData => ({
  type: LOGIN,
  payload: formData,
});
export const loginSuccessAction = user => ({
  type: LOGIN_SUCCESS,
  payload: user,
});
export const loginFailureAction = error => ({
  type: LOGIN_FAILURE,
  payload: error,
});
export const rehydrateAction = user => ({
  type: REHYDRATE,
  payload: user,
});
export const rehydrateSuccessAction = payload => ({
  type: REHYDRATE_SUCCESS,
  payload,
});
export const rehydrateFailureAction = error => ({
  type: REHYDRATE_FAILURE,
  payload: error,
});
export const logoutAction = () => ({
  type: LOGOUT,
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
export const deleteUserFailureAction = error => ({
  type: DELETE_USER_FAILURE,
  payload: error,
});
export const clearMessageAction = () => ({
  type: CLEAR_MESSAGE,
});
export const hidePrivateRoomAction = (roomId, loggedUserId, status) => ({
  type: HIDE_PRIVATE_ROOM,
  payload: {
    roomId,
    loggedUserId,
    status,
  },
});
export const hidePrivateRoomSuccessAction = room => ({
  type: HIDE_PRIVATE_ROOM_SUCCESS,
  payload: room,
});
/*
 * Export default
*/
export default reducer;
