import { connect } from 'react-redux';

import MessageListItem from '../../components/MessagesList/MessageListItem';
import {
  updateMessageAction,
  deleteMessageAction,
} from '../../../../../store/reducers/messageReducer';

const mapStateToProps = ({ chatReducer, messageReducer }) => ({
  roomFetchProcess: chatReducer.roomFetchProcess,
  messages: messageReducer.messages,
});

const mapDispatchToProps = dispatch => ({
  updateMessageAction: (messageId, values) => {
    dispatch(updateMessageAction(messageId, values));
  },
  deleteMessageAction: (messageId, values) => {
    dispatch(deleteMessageAction(messageId, values));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const MessageListItemContainer = createContainer(MessageListItem);
export default MessageListItemContainer;
