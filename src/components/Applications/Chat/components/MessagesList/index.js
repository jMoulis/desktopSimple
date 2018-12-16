import React from 'react';
import PropTypes from 'prop-types';
import MessageListItem from '../../containers/MessagesList/MessageListItem';
import './index.css';
import TempMessage from './TempMessage';
import Utils from '../../../../../Utils/utils';

class MessageList extends React.Component {
  static propTypes = {
    roomFetchProcess: PropTypes.object.isRequired,
    fetchMessagesAction: PropTypes.func.isRequired,
    typingStatus: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    loggedUser: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    totalMessage: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.messagesList = React.createRef();
    this.state = {
      shouldScrollBottom: true,
    };
    this.utils = new Utils();
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.shouldScrollBottom ||
      this.props.totalMessage > prevProps.totalMessage ||
      this.props.typingStatus.isTyping
    ) {
      this.scrollToBottom();
    }
    const prevRoomId = prevProps.roomFetchProcess.room._id;
    const {
      fetchMessagesAction,
      roomFetchProcess: { room },
    } = this.props;
    if (room._id && typeof prevRoomId === 'undefined') {
      return fetchMessagesAction(room._id);
    }
    if (room._id && room._id.toString() !== prevRoomId.toString()) {
      this.scrollToBottom();
      return fetchMessagesAction(room._id);
    }
    return true;
  }

  shouldScrollBottomAction = bool =>
    this.setState(() => ({ shouldScrollBottom: bool }));

  scrollToBottom = () => {
    this.messagesList.current.scrollTop = this.messagesList.current.scrollHeight;
  };

  handleScroll = evt => {
    const {
      messages,
      totalMessage,
      fetchMessagesAction,
      limit,
      roomFetchProcess: { room },
    } = this.props;
    const element = evt.target;
    if (this.reachedTop(evt.target)) {
      if (messages.length < totalMessage) {
        fetchMessagesAction(room._id, { limit: limit + 10 });
      }
    }
    this.setState(() => ({
      scrollPosition: element.scrollTop,
      init: true,
      shouldScrollBottom: false,
    }));
  };

  reachedTop = element => element.scrollTop === 0;

  render() {
    const {
      roomFetchProcess: { room },
      messages,
      loggedUser,
      socket,
      typingStatus,
    } = this.props;

    const typingUsersExceptLoggedUser = typingStatus.typingUsers.filter(
      typingUser => typingUser._id !== loggedUser._id,
    );

    if (this.utils.isObjectEmpty(room))
      return (
        <ul ref={this.messagesList} className="chat-message-list">
          <li className="chat-message-list-item">
            <span>No room selected</span>
          </li>
        </ul>
      );
    if (messages) {
      if (messages && messages.length === 0) {
        return (
          <ul ref={this.messagesList} className="chat-message-list">
            <li className="chat-message-list-item">
              <span>No Message yet</span>
            </li>
          </ul>
        );
      }
      return (
        <ul
          ref={this.messagesList}
          className="chat-message-list"
          onScroll={this.handleScroll}
        >
          {messages
            .filter(message => message.room === room._id)
            .map(message => (
              <li key={message._id} className="chat-message-list-item">
                <MessageListItem
                  message={message}
                  loggedUser={loggedUser}
                  socket={socket}
                  room={room}
                />
              </li>
            ))}
          {typingUsersExceptLoggedUser.length > 0 &&
            typingStatus.room &&
            typingStatus.room._id === room._id && (
              <TempMessage users={typingUsersExceptLoggedUser} />
            )}
        </ul>
      );
    }
    return (
      <ul ref={this.messagesList} className="chat-message-list">
        <li>
          <span>No Message yet</span>
        </li>
      </ul>
    );
  }
}

export default MessageList;
