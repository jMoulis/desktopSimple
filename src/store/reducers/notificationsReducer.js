const initialState = {
  notifications: [],
};

export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
export const FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';

export const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS';

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS: {
      return {
        ...state,
      };
    }
    case FETCH_NOTIFICATIONS_SUCCESS: {
      const { notifications } = action.payload;
      return {
        ...state,
        notifications,
      };
    }
    case UPDATE_NOTIFICATIONS: {
      return {
        ...state,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export const fetchNotificationsAction = () => ({
  type: FETCH_NOTIFICATIONS,
});

export const fetchNotificationsSuccessAction = payload => ({
  type: FETCH_NOTIFICATIONS_SUCCESS,
  payload,
});

export const updateNotificationsAction = ({ type, sender }) => ({
  type: UPDATE_NOTIFICATIONS,
  payload: {
    type,
    sender,
  },
});
export default reducer;
