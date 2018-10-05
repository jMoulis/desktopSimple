import { connect } from 'react-redux';

import Chat from '../components';
import {
  fetchRoomsAction,
  fetchRoomAction,
  newRoomMessageSuccessAction,
} from '../../../../store/reducers/chatReducer';
import { fetchNotificationsSuccessAction } from '../../../../store/reducers/notificationsReducer';

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
  fetchRoomsAction: () => {
    dispatch(fetchRoomsAction());
  },
  fetchRoomAction: roomId => {
    dispatch(fetchRoomAction(roomId));
  },
  newRoomMessageSuccessAction: (roomId, message) => {
    dispatch(newRoomMessageSuccessAction(roomId, message));
  },
  fetchNotificationsSuccessAction: notifications => {
    dispatch(fetchNotificationsSuccessAction(notifications));
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
