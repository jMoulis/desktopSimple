import { connect } from 'react-redux';

import MessageList from '../../components/MessagesList';

const mapStateToProps = ({ chatReducer }) => ({
  roomFetchProcess: chatReducer.roomFetchProcess,
});

const createContainer = connect(
  mapStateToProps,
  null,
);
const MessageListContainer = createContainer(MessageList);
export default MessageListContainer;
