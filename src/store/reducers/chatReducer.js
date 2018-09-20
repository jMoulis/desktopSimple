/*
 * Npm Import
 */

/*
 * Local Import
 */
/*
 * Types
 */
export const FETCH_MESSAGE = 'FETCH_MESSAGE';
export const FETCH_MESSAGE_SUCCESS = 'FETCH_MESSAGE_SUCCESS';
export const FETCH_MESSAGE_FAILURE = 'FETCH_MESSAGE_FAILURE';

export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE';

export const CREATE_MESSAGE = 'CREATE_MESSAGE';
export const CREATE_MESSAGE_SUCCESS = 'CREATE_MESSAGE_SUCCESS';
export const CREATE_MESSAGE_FAILURE = 'CREATE_MESSAGE_FAILURE';

export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const EDIT_MESSAGE_SUCCESS = 'EDIT_MESSAGE_SUCCESS';
export const EDIT_MESSAGE_FAILURE = 'EDIT_MESSAGE_FAILURE';

export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';
export const DELETE_MESSAGE_FAILURE = 'DELETE_MESSAGE_FAILURE';

export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

/*
 * State
*/
const initialState = {
  messageCreation: {
    message: {},
    success: null,
    loading: true,
    error: null,
  },
  messageListProcess: {
    messages: [],
    success: null,
    loading: true,
    error: null,
  },
  activeMessageProcess: {
    message: {},
    success: null,
    loading: true,
    error: null,
  },
};

const swap = (array, value1, value2) => {
  let temp = array;
};
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case CREATE_MESSAGE: {
      return {
        ...state,
        messageCreation: {
          message: [],
          loading: true,
          error: null,
          success: null,
        },
      };
    }
    case CREATE_MESSAGE_SUCCESS: {
      return {
        ...state,
        messageListProcess: {
          messages: [...state.messageListProcess.messages, action.payload],
          loading: false,
        },
      };
    }
    case CREATE_MESSAGE_FAILURE: {
      return {
        ...state,
        messageCreation: {
          message: {},
          loading: false,
          error: action.payload,
          success: null,
        },
      };
    }
    case FETCH_MESSAGES: {
      return {
        ...state,
        messageListProcess: {
          ...state.messageListProcess,
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_MESSAGES_SUCCESS: {
      return {
        ...state,
        messageListProcess: {
          messages: [
            ...state.messageListProcess.messages,
            ...action.payload.messages,
          ],
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case FETCH_MESSAGES_FAILURE: {
      return {
        ...state,
        messageListProcess: {
          messages: [],
          success: null,
          loading: false,
          error: action.payload.error,
        },
      };
    }
    case FETCH_MESSAGE: {
      return {
        ...state,
        activeMessageProcess: {
          ...state.activeMessageProcess,
          success: null,
          loading: true,
          error: null,
        },
      };
    }
    case FETCH_MESSAGE_SUCCESS: {
      return {
        ...state,
        activeMessageProcess: {
          message: action.payload.message,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case FETCH_MESSAGE_FAILURE: {
      return {
        ...state,
        activeMessageProcess: {
          message: {},
          success: null,
          loading: false,
          error: action.payload.error,
        },
      };
    }
    case EDIT_MESSAGE: {
      return {
        ...state,
      };
    }
    case EDIT_MESSAGE_SUCCESS: {
      return {
        ...state,
        activeMessageProcess: {
          message: action.payload.message,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case EDIT_MESSAGE_FAILURE: {
      return {
        ...state,
        activeMessageProcess: {
          ...state.activeMessageProcess,
          loading: false,
          error: action.payload,
        },
      };
    }
    case DELETE_MESSAGE: {
      return {
        ...state,
      };
    }
    case DELETE_MESSAGE_SUCCESS: {
      return {
        ...state,
        activeMessageProcess: {
          message: {},
          success: null,
          loading: false,
          error: null,
        },
        messageListProcess: {
          messages: action.payload.messages,
          success: action.payload.success,
          loading: false,
          error: null,
        },
      };
    }
    case DELETE_MESSAGE_FAILURE: {
      return {
        ...state,
        activeMessageProcess: {
          ...state.activeMessageProcess,
          loading: false,
          error: action.payload,
        },
      };
    }

    case CLEAR_MESSAGE: {
      return {
        ...state,
        messageCreation: {
          message: {},
          success: null,
          loading: true,
          error: null,
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

export const fetchMessageAction = messageId => ({
  type: FETCH_MESSAGE,
  messageId,
});
export const fetchMessageSuccessAction = data => ({
  type: FETCH_MESSAGE_SUCCESS,
  payload: data,
});
export const fetchMessageFailureAction = error => ({
  type: FETCH_MESSAGE_FAILURE,
  payload: error,
});
export const fetchMessagesAction = filter => ({
  type: FETCH_MESSAGES,
  payload: filter,
});
export const fetchMessagesSuccessAction = data => ({
  type: FETCH_MESSAGES_SUCCESS,
  payload: data,
});
export const fetchMessagesFailureAction = error => ({
  type: FETCH_MESSAGES_FAILURE,
  payload: error,
});
export const editMessageAction = updates => ({
  type: EDIT_MESSAGE,
  payload: updates,
});
export const editMessageSuccessAction = data => ({
  type: EDIT_MESSAGE_SUCCESS,
  payload: data,
});
export const editMessageFailureAction = error => ({
  type: EDIT_MESSAGE_FAILURE,
  payload: error,
});
export const createMessageAction = values => ({
  type: CREATE_MESSAGE,
  payload: values,
});
export const createMessageSuccessAction = data => ({
  type: CREATE_MESSAGE_SUCCESS,
  payload: data,
});
export const createMessageFailureAction = error => ({
  type: CREATE_MESSAGE_FAILURE,
  payload: error,
});
export const clearMessageAction = () => ({
  type: CLEAR_MESSAGE,
});
export const deleteMessageAction = messageId => ({
  type: DELETE_MESSAGE,
  messageId,
});
export const deleteMessageSuccessAction = data => ({
  type: DELETE_MESSAGE_SUCCESS,
  payload: data,
});
export const deleteMessageFailureAction = error => ({
  type: DELETE_MESSAGE_FAILURE,
  payload: error,
});
/*
 * Export default
*/
export default reducer;
