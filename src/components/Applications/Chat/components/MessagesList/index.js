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
  };

  constructor(props) {
    super(props);
    this.messagesList = React.createRef();
  }
  componentDidMount() {
    this.scrollToBottom(this.messagesList.current);
  }

  componentDidUpdate(prevProps) {
    this.scrollToBottom(this.messagesList.current);

    const prevRoomId = prevProps.roomFetchProcess.room._id;
    const {
      fetchMessagesAction,
      roomFetchProcess: { room },
    } = this.props;
    if (room._id && typeof prevRoomId === 'undefined') {
      return fetchMessagesAction(room._id);
    }
    if (room._id.toString() !== prevRoomId.toString()) {
      return fetchMessagesAction(room._id);
    }
    return true;
  }

  scrollToBottom = element => {
    element.scrollTop = element.scrollHeight;
  };

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
        <ul ref={this.messagesList} className="chat-message-list">
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
