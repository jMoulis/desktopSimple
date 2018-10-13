import { connect } from 'react-redux';

import MessageList from '../../components/MessagesList';
import { fetchMessagesAction } from '../../../../../store/reducers/messageReducer';

const mapStateToProps = ({ chatReducer, messageReducer }) => ({
  roomFetchProcess: chatReducer.roomFetchProcess,
  messages: messageReducer.messages,
});

const mapDispatchToProps = dispatch => ({
  fetchMessagesAction: roomId => {
    dispatch(fetchMessagesAction(roomId));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const MessageListContainer = createContainer(MessageList);
export default MessageListContainer;
