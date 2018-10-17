import { connect } from 'react-redux';

import MessageList from '../../components/MessagesList';
import { fetchMessagesAction } from '../../../../../store/reducers/messageReducer';

const mapStateToProps = ({ chatReducer, messageReducer }) => ({
  roomFetchProcess: chatReducer.roomFetchProcess,
  messages: messageReducer.messages,
  totalMessage: messageReducer.totalMessage,
  limit: messageReducer.limit,
});

const mapDispatchToProps = dispatch => ({
  fetchMessagesAction: (roomId, limit) => {
    dispatch(fetchMessagesAction(roomId, limit));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const MessageListContainer = createContainer(MessageList);
export default MessageListContainer;
