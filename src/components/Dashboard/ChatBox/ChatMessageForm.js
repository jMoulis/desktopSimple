import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChatMessageForm extends Component {
  state = {
    message: '',
  };
  handleSendMessage = evt => {
    evt.preventDefault();
    const { socket, room, user, receiver } = this.props;
    socket.emit('NEW_MESSAGE', {
      room,
      receiver: receiver._id,
      sender: user._id,
      message: this.state.message,
    });
  };

  handleTextAreaChange = evt => {
    const { value } = evt.target;
    this.setState(() => ({
      message: value,
    }));
  };

  render() {
    return (
      <form onSubmit={this.handleSendMessage}>
        <textarea
          value={this.state.message}
          onChange={this.handleTextAreaChange}
        />
        <button>Send</button>
      </form>
    );
  }
}

ChatMessageForm.propTypes = {};

export default ChatMessageForm;
