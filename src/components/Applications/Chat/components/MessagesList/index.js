import React from 'react';
import PropTypes from 'prop-types';
import MessageListItem from './MessageListItem';
import './index.css';

class MessageList extends React.Component {
  static propTypes = {
    roomFetchProcess: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.messagesList = React.createRef();
  }
  componentDidMount() {
    this.scrollToBottom(this.messagesList.current);
  }

  componentDidUpdate() {
    this.scrollToBottom(this.messagesList.current);
  }

  scrollToBottom = element => {
    element.scrollTop = element.scrollHeight;
  };

  render() {
    const {
      roomFetchProcess: { room },
    } = this.props;
    if (room) {
      if (room.messages.length === 0) {
        return (
          <ul ref={this.messagesList} className="chat-message-list">
            <li>
              <span>No Message yet</span>
            </li>
          </ul>
        );
      }
      return (
        <ul ref={this.messagesList} className="chat-message-list">
          {room.messages.map(message => (
            <li key={message._id}>
              <MessageListItem message={message} />
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
