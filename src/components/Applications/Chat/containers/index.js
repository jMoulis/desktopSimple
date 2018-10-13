import { connect } from 'react-redux';

import Chat from '../components';
import {
  fetchRoomsAction,
  fetchRoomAction,
} from '../../../../store/reducers/chatReducer';
import { fetchNotificationsSuccessAction } from '../../../../store/reducers/notificationsReducer';
import {
  updateMessageSuccessAction,
  newMessageSuccessAction,
  deleteMessageSuccessAction,
  newReplySuccessAction,
} from '../../../../store/reducers/messageReducer';

const mapStateToProps = ({ chatReducer }) => ({
  roomsFetchProcess: chatReducer.roomsFetchProcess,
  room: chatReducer.roomFetchProcess.room,
});

const mapDispatchToProps = dispatch => ({
  fetchRoomsAction: () => {
    dispatch(fetchRoomsAction());
  },
  fetchRoomAction: roomId => {
    dispatch(fetchRoomAction(roomId));
  },
  fetchNotificationsSuccessAction: notifications => {
    dispatch(fetchNotificationsSuccessAction(notifications));
  },
  updateMessageSuccessAction: message => {
    dispatch(updateMessageSuccessAction(message));
  },
  newMessageSuccessAction: message => {
    dispatch(newMessageSuccessAction(message));
  },
  deleteMessageSuccessAction: message => {
    dispatch(deleteMessageSuccessAction(message));
  },
  newReplySuccessAction: reply => {
    dispatch(newReplySuccessAction(reply));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const ChatContainer = createContainer(Chat);
export default ChatContainer;
