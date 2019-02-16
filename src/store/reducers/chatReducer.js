import Utils from '../../Utils/utils';

export const FETCH_ROOMS = 'FETCH_ROOMS';
export const FETCH_ROOMS_SUCCESS = 'FETCH_ROOMS_SUCCESS';
export const FETCH_ROOMS_FAILURE = 'FETCH_ROOMS_FAILURE';

export const SET_DEFAULT_ROOM = 'SET_DEFAULT_ROOM';

export const FETCH_ROOMS_UPDATE_STATUS = 'FETCH_ROOMS_UPDATE_STATUS';

export const FETCH_ROOM = 'FETCH_ROOM';
export const FETCH_ROOM_SUCCESS = 'FETCH_ROOM_SUCCESS';
export const FETCH_ROOM_FAILURE = 'FETCH_ROOM_FAILURE';

export const ADD_ROOM_TO_STATE = 'ADD_ROOM_TO_STATE';

export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

export const FETCH_USERS_FROM_PRIVATE_MESSAGE =
  'FETCH_USERS_FROM_PRIVATE_MESSAGE';
export const FETCH_USERS_FROM_PRIVATE_MESSAGE_SUCCESS =
  'FETCH_USERS_FROM_PRIVATE_MESSAGE_SUCCESS';
export const FETCH_USERS_FROM_PRIVATE_MESSAGE_FAILURE =
  'FETCH_USERS_FROM_PRIVATE_MESSAGE_FAILURE';

export const DELETE_ROOM = 'DELETE_ROOM';

const initialState = {
  roomFetchProcess: {
    room: {},
    success: null,
    loading: true,
    error: null,
  },
  roomsFetchProcess: {
    rooms: {},
    success: null,
    loading: true,
    error: null,
  },
  usersPMProcess: {
    loading: false,
    users: [],
    error: null,
  },
};

const utils = new Utils();
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_ROOM: {
      return {
        ...state,
      };
    }
    case FETCH_ROOM_SUCCESS: {
      return {
        ...state,
        roomFetchProcess: {
          room: action.payload.room,
          success: true,
          loading: false,
          error: null,
        },
      };
    }
    case FETCH_ROOM_FAILURE: {
      return {
        ...state,
        roomFetchProcess: {
          room: {},
          success: false,
          loading: false,
          error: action.payload,
        },
      };
    }
    case FETCH_ROOMS: {
      return {
        ...state,
      };
    }

    case FETCH_ROOMS_SUCCESS: {
      const defaultRoom = action.payload.rooms.globalRooms.find(
        room => room.name === 'GENERAL',
      );
      if (!utils.isObjectEmpty(state.roomFetchProcess.room)) {
        return {
          ...state,
          roomsFetchProcess: {
            rooms: action.payload.rooms,
            success: true,
            loading: false,
            error: null,
          },
        };
      }
      return {
        ...state,
        roomsFetchProcess: {
          rooms: action.payload.rooms,
          success: true,
          loading: false,
          error: null,
        },
        roomFetchProcess: {
          ...state.roomFetchProcess,
          room: defaultRoom || {},
        },
        defaultRoom,
      };
    }
    case FETCH_ROOMS_FAILURE: {
      return {
        ...state,
        roomsFetchProcess: {
          rooms: {},
          success: null,
          loading: false,
          error: null,
        },
      };
    }

    case FETCH_ROOMS_UPDATE_STATUS: {
      return {
        ...state,
      };
    }

    case SET_DEFAULT_ROOM: {
      return {
        ...state,
        roomFetchProcess: {
          ...state.roomFetchProcess,
          room: state.defaultRoom || {},
        },
      };
    }

    case FETCH_USERS_FROM_PRIVATE_MESSAGE: {
      return {
        ...state,
        usersPMProcess: {
          loading: true,
          users: [...state.usersPMProcess.users],
          error: null,
        },
      };
    }
    case FETCH_USERS_FROM_PRIVATE_MESSAGE_SUCCESS: {
      return {
        ...state,
        usersPMProcess: {
          loading: false,
          users: action.payload.users,
          error: null,
        },
      };
    }
    case FETCH_USERS_FROM_PRIVATE_MESSAGE_FAILURE: {
      return {
        ...state,
        usersPMProcess: {
          loading: false,
          users: [],
          error: action.payload,
        },
      };
    }

    case ADD_ROOM_TO_STATE: {
      const rooms = [...state.roomsFetchProcess.rooms];
      if (rooms.some(room => room._id === action.payload._id) === false) {
        rooms.unshift(action.payload);
      }
      return {
        ...state,
        roomsFetchProcess: {
          rooms,
        },
      };
    }

    case DELETE_ROOM: {
      const { rooms } = action.payload;
      return {
        ...state,
        roomsFetchProcess: {
          ...state.roomsFetchProcess,
          rooms,
        },
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export const fetchRoomAction = roomId => ({
  type: FETCH_ROOM,
  payload: roomId,
});
export const fetchRoomSuccessAction = data => ({
  type: FETCH_ROOM_SUCCESS,
  payload: data,
});
export const fetchRoomFailureAction = error => ({
  type: FETCH_ROOM_FAILURE,
  payload: error,
});

export const fetchRoomsAction = type => ({
  type: FETCH_ROOMS,
  payload: type,
});
export const fetchRoomsSuccessAction = data => ({
  type: FETCH_ROOMS_SUCCESS,
  payload: data,
});
export const fetchRoomsFailureAction = error => ({
  type: FETCH_ROOMS_FAILURE,
  payload: error,
});

export const fetchUsersFromPM = search => ({
  type: FETCH_USERS_FROM_PRIVATE_MESSAGE,
  payload: search,
});
export const fetchUsersFromPMSuccess = data => ({
  type: FETCH_USERS_FROM_PRIVATE_MESSAGE_SUCCESS,
  payload: data,
});
export const fetchUsersFromPMFailure = error => ({
  type: FETCH_USERS_FROM_PRIVATE_MESSAGE_FAILURE,
  payload: error,
});

export const addRoomToStateAction = room => ({
  type: ADD_ROOM_TO_STATE,
  payload: room,
});

export const setDefaultRoomAction = () => ({
  type: SET_DEFAULT_ROOM,
});

export const fetchRoomsAndUpdateStatus = (roomId, loggedUserId, status) => ({
  type: FETCH_ROOMS_UPDATE_STATUS,
  payload: {
    roomId,
    loggedUserId,
    status,
  },
});

export const deleteRoomAction = rooms => ({
  type: DELETE_ROOM,
  payload: rooms,
});

export default reducer;
