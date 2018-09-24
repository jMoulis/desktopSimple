export const FETCH_ROOMS = 'FETCH_ROOMS';
export const FETCH_ROOMS_SUCCESS = 'FETCH_ROOMS_SUCCESS';
export const FETCH_ROOMS_FAILURE = 'FETCH_ROOMS_FAILURE';

export const FETCH_ROOM = 'FETCH_ROOM';
export const FETCH_ROOM_SUCCESS = 'FETCH_ROOM_SUCCESS';
export const FETCH_ROOM_FAILURE = 'FETCH_ROOM_FAILURE';

export const NEW_MESSAGE_ROOM_SUCCESS = 'NEW_MESSAGE_ROOM_SUCCESS';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

const initialState = {
  roomFetchProcess: {
    room: null,
    success: null,
    loading: true,
    error: null,
  },
  roomsFetchProcess: {
    rooms: [],
    success: null,
    loading: true,
    error: null,
  },
};

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
          room: null,
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
      const defaultRoom = action.payload.rooms.find(
        room => room.name === 'GENERAL',
      );
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
          room: defaultRoom,
        },
      };
    }
    case FETCH_ROOMS_FAILURE: {
      return {
        ...state,
        roomsFetchProcess: {
          rooms: [],
          success: null,
          loading: false,
          error: null,
        },
      };
    }
    case NEW_MESSAGE_ROOM_SUCCESS: {
      let { messages } = state.roomFetchProcess.room;
      if (state.roomFetchProcess.room._id === action.payload.roomId) {
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

export default reducer;
