import { connect } from 'react-redux';

import Chat from '../components/Chat';
import {
  fetchRoomsAction,
  fetchRoomAction,
  fetchRoomsSuccessAction,
} from '../../../../store/reducers/chatReducer';
import { fetchNotificationsSuccessAction } from '../../../../store/reducers/notificationsReducer';
import {
  updateMessageSuccessAction,
  newMessageSuccessAction,
  deleteMessageSuccessAction,
  newReplySuccessAction,
  fetchMessagesSuccessAction,
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
  fetchMessagesSuccessAction: messages => {
    dispatch(fetchMessagesSuccessAction(messages));
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
  fetchRoomsSuccessAction: rooms => {
    dispatch(fetchRoomsSuccessAction(rooms));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const ChatContainer = createContainer(Chat);
export default ChatContainer;
