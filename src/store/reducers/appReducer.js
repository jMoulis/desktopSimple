/*
 * Npm Import
 */
/*
 * Local Import
 */

/*
 * Types
 */
export const SHOW_USER_DETAIL_MODAL = 'SHOW_USER_DETAIL_MODAL';
export const SHOW_OVERFLOW = 'SHOW_OVERFLOW';

export const CONNECTED_USERS = 'CONNECTED_USERS';
/*
 * State
*/
const initialState = {
  showUserDetailModal: false,
  userId: '',
  showOverflow: true,
  connectedUsers: [],
};

/*
 * Reducer
 */
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SHOW_USER_DETAIL_MODAL:
      return {
        ...state,
        showUserDetailModal: !state.showUserDetailModal,
        userId: action.userId,
      };
    case SHOW_OVERFLOW:
      return {
        ...state,
        showOverflow: !state.showOverflow,
      };
    case CONNECTED_USERS: {
      return {
        ...state,
        connectedUsers: action.payload,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export const showUserDetailModalAction = userId => ({
  type: SHOW_USER_DETAIL_MODAL,
  userId,
});

export const showOverflowAction = () => ({
  type: SHOW_OVERFLOW,
});

export const setConnectedUsersAction = users => ({
  type: CONNECTED_USERS,
  payload: users,
});

export default reducer;
