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

export const LOGOUT = 'LOGOUT';

/*
 * State
*/
const initialState = {
  auth: false,
  loginForm: {
    display: false,
  },
  loginProcess: {
    loggedUser: {},
    logging: false,
    error: null,
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
        loginProcess: {
          loggedUser: {
            user: action.payload.user,
            loading: false,
            error: null,
          },
        },
        auth: action.payload.auth,
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
          loggedUser: {},
          logging: true,
          error: null,
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
          loggedUser: {},
          logging: true,
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
        },
        auth: action.payload.auth,
      };
    }
    case REHYDRATE_FAILURE: {
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
/*
 * Export default
*/
export default reducer;
