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
/*
 * State
*/
const initialState = {
  showUserDetailModal: false,
  userId: '',
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
    default:
      return {
        ...state,
      };
  }
};

/*
 *Action creators
 */
export const showUserDetailModalAction = userId => ({
  type: SHOW_USER_DETAIL_MODAL,
  userId,
});
/*
 * Export default
*/
export default reducer;
