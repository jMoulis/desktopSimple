import React from 'react';
import PropTypes from 'prop-types';
import MessageListItem from '../../containers/MessagesList/MessageListItem';
import './index.css';

class MessageList extends React.Component {
  static propTypes = {
    roomFetchProcess: PropTypes.object.isRequired,
    fetchMessagesAction: PropTypes.func.isRequired,
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
      init: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.state.init) {
      this.scrollToBottom(this.messagesList.current);
    }
    const prevRoomId = prevProps.roomFetchProcess.room._id;
    const {
      fetchMessagesAction,
      roomFetchProcess: { room },
    } = this.props;
    if (room._id && typeof prevRoomId === 'undefined') {
      return fetchMessagesAction(room._id);
    }
    if (room._id.toString() !== prevRoomId.toString()) {
      this.setInit(false);
      return fetchMessagesAction(room._id);
    }
    return true;
  }

  setInit = bool => this.setState(() => ({ init: bool }));
  scrollToBottom = element => {
    element.scrollTop = element.scrollHeight;
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
    }));
  };

  reachedTop = element => element.scrollTop === 0;
  render() {
    const {
      roomFetchProcess: { room },
      messages,
      loggedUser,
      socket,
    } = this.props;
    if (room && messages) {
      if (messages.length === 0) {
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
          {messages.map(message => (
            <li key={message._id} className="chat-message-list-item">
              <MessageListItem
                message={message}
                loggedUser={loggedUser}
                socket={socket}
                room={room}
              />
            </li>
          ))}
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
