const initialState = {
  messages: [],
};

export const NEW_MESSAGE_SUCCESS = 'NEW_MESSAGE_SUCCESS';
export const NEW_MESSAGE_FAILURE = 'NEW_MESSAGE_FAILURE';

export const NEW_REPLY = 'NEW_REPLY';
export const NEW_REPLY_SUCCESS = 'NEW_REPLY_SUCCESS';
export const NEW_REPLY_FAILURE = 'NEW_REPLY_FAILURE';

export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_FAILURE = 'FETCH_MESSAGES_FAILURE';

export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const UPDATE_MESSAGE_SUCCESS = 'UPDATE_MESSAGE_SUCCESS';

export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_MESSAGES: {
      return {
        ...state,
      };
    }
    case FETCH_MESSAGES_SUCCESS: {
      const { messages } = action.payload;
      return {
        ...state,
        messages,
      };
    }
    case FETCH_MESSAGES_FAILURE: {
      const { error } = action.payload;
      return {
        ...state,
        messages: [],
        error,
      };
    }
    case UPDATE_MESSAGE: {
      return {
        ...state,
      };
    }

    case UPDATE_MESSAGE_SUCCESS: {
      const messages = state.messages.map(message => {
        if (message._id === action.payload.message._id) {
          return action.payload.message;
        }
        return message;
      });
      return {
        ...state,
        messages,
      };
    }
    case NEW_MESSAGE_SUCCESS: {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    }
    case NEW_REPLY_SUCCESS: {
      const messages = state.messages.map(message => {
        if (message._id === action.payload.reply._id) {
          return action.payload.reply;
        }
        return message;
      });
      return {
        ...state,
        messages,
      };
    }
    case DELETE_MESSAGE: {
      return {
        ...state,
      };
    }
    case DELETE_MESSAGE_SUCCESS: {
      const messages = state.messages.filter(
        message => message._id !== action.payload.message._id,
      );
      return {
        ...state,
        messages,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export const newMessageSuccessAction = message => ({
  type: NEW_MESSAGE_SUCCESS,
  payload: message,
});

export const newReplySuccessAction = reply => ({
  type: NEW_REPLY_SUCCESS,
  payload: {
    reply,
  },
});

export const fetchMessagesAction = roomId => ({
  type: FETCH_MESSAGES,
  payload: roomId,
});

export const fetchMessagesSuccessAction = payload => ({
  type: FETCH_MESSAGES_SUCCESS,
  payload,
});

export const fetchMessagesFailureAction = payload => ({
  type: FETCH_MESSAGES_FAILURE,
  payload,
});

export const updateMessageAction = (messageId, values) => ({
  type: UPDATE_MESSAGE,
  payload: {
    messageId,
    values,
  },
});
export const updateMessageSuccessAction = message => ({
  type: UPDATE_MESSAGE_SUCCESS,
  payload: {
    message,
  },
});

export const deleteMessageAction = messageId => ({
  type: DELETE_MESSAGE,
  payload: messageId,
});

export const deleteMessageSuccessAction = message => ({
  type: DELETE_MESSAGE_SUCCESS,
  payload: { message },
});

export default reducer;
