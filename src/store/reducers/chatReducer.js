import Utils from '../../Utils/utils';

export const FETCH_ROOMS = 'FETCH_ROOMS';
export const FETCH_ROOMS_SUCCESS = 'FETCH_ROOMS_SUCCESS';
export const FETCH_ROOMS_FAILURE = 'FETCH_ROOMS_FAILURE';

export const FETCH_ROOMS_UPDATE_STATUS = 'FETCH_ROOMS_UPDATE_STATUS';

export const FETCH_ROOM = 'FETCH_ROOM';
export const FETCH_ROOM_SUCCESS = 'FETCH_ROOM_SUCCESS';
export const FETCH_ROOM_FAILURE = 'FETCH_ROOM_FAILURE';

export const ADD_ROOM_TO_STATE = 'ADD_ROOM_TO_STATE';

export const NEW_MESSAGE_ROOM_SUCCESS = 'NEW_MESSAGE_ROOM_SUCCESS';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

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

    case NEW_MESSAGE_ROOM_SUCCESS: {
      let messages;
      if (state.roomFetchProcess.room && state.roomFetchProcess.room.messages) {
        messages = [...state.roomFetchProcess.room.messages];
      }
      if (
        state.roomFetchProcess.room &&
        state.roomFetchProcess.room._id === action.payload.roomId
      ) {
        messages = [...messages, action.payload.message];
      }
      return {
        ...state,
        roomFetchProcess: {
          room: {
            ...state.roomFetchProcess.room,
            messages,
          },
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
export const newRoomMessageSuccessAction = room => ({
  type: NEW_MESSAGE_ROOM_SUCCESS,
  payload: {
    message: room.message,
    roomId: room.room,
  },
});
export const addRoomToStateAction = room => ({
  type: ADD_ROOM_TO_STATE,
  payload: room,
});
export const fetchRoomsAndUpdateStatus = (roomId, loggedUserId, status) => ({
  type: FETCH_ROOMS_UPDATE_STATUS,
  payload: {
    roomId,
    loggedUserId,
    status,
  },
});

export default reducer;
