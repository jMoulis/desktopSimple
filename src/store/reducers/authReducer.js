/*
 * Npm Import
 */
/*
 * Local Import
 */

/*
 * Types
 */
export const DISPLAY_LOGIN_FORM = 'DISPLAY_LOGIN_FORM';

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REHYDRATE = 'REHYDRATE';
export const REHYDRATE_SUCCESS = 'REHYDRATE_SUCCESS';
export const REHYDRATE_FAILURE = 'REHYDRATE_FAILURE';

/*
 * State
*/
const initialState = {
  loginForm: {
    display: false,
  },
  loginProcess: {
    auth: false,
    loggedUser: {},
    logging: false,
    error: null,
  },
};

/*
 * Reducer
 */
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case DISPLAY_LOGIN_FORM: {
      return {
        ...state,
        loginForm: {
          ...state.loginForm,
          display: true,
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
          auth: false,
        },
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        loginProcess: {
          loggedUser: action.payload.user,
          logging: false,
          error: null,
          auth: action.payload.auth,
        },
      };
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        loginProcess: {
          loggedUser: {},
          logging: false,
          error: action.payload,
          auth: action.payload.auth,
        },
      };
    }
    case REHYDRATE: {
      return {
        ...state,
        loginProcess: {
          loggedUser: {},
          logging: true,
          error: null,
          auth: false,
        },
      };
    }
    case REHYDRATE_SUCCESS: {
      return {
        ...state,
        loginProcess: {
          loggedUser: action.payload.user,
          logging: false,
          error: null,
          auth: action.payload.auth,
        },
      };
    }
    case REHYDRATE_FAILURE: {
      return {
        ...state,
        loginProcess: {
          loggedUser: {},
          logging: false,
          error: action.payload,
          auth: action.payload.auth,
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
export const displayLoginFormAction = () => ({
  type: DISPLAY_LOGIN_FORM,
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
/*
 * Export default
*/
export default reducer;
