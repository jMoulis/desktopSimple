import { connect } from 'react-redux';

import Chat from '../components';
import {
  fetchRoomsAction,
  fetchRoomAction,
  newRoomMessageSuccessAction,
} from '../../../../store/reducers/chatReducer';

/*
 * Code
 */

// State
const mapStateToProps = ({ chatReducer }) => ({
  roomsFetchProcess: chatReducer.roomsFetchProcess,
  room: chatReducer.roomFetchProcess.room,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchRoomsAction: type => {
    dispatch(fetchRoomsAction(type));
  },
  fetchRoomAction: roomId => {
    dispatch(fetchRoomAction(roomId));
  },
  newRoomMessageSuccessAction: (roomId, message) => {
    dispatch(newRoomMessageSuccessAction(roomId, message));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const ChatContainer = createContainer(Chat);
export default ChatContainer;
