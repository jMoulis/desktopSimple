/*
 * Npm Import
 */

/*
 * Local Import
 */
/*
 * Types
 */
export const FETCH_CHAT = 'FETCH_CHAT';
export const FETCH_CHAT_SUCCESS = 'FETCH_CHAT_SUCCESS';

/*
 * State
*/
const initialState = {
  chat: {
    started: false,
  },
};

/*
 * Reducer
 */
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_CHAT: {
      return {
        ...state,
        chat: {
          started: true,
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
export const fetchChatAction = () => ({
  type: FETCH_CHAT,
});
export const fetchChatSuccessAction = response => ({
  type: FETCH_CHAT_SUCCESS,
  payload: response,
});
/*
 * Export default
*/
export default reducer;
