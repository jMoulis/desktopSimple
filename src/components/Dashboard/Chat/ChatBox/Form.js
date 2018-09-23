import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChatBoxForm extends Component {
  state = {
    message: '',
  };

  handleSendMessage = evt => {
    evt.preventDefault();
    const { socket, room, loggedUser, receiver, callback } = this.props;

    socket.emit('NEW_MESSAGE', {
      room,
      receiver: receiver._id,
      sender: loggedUser._id,
      message: this.state.message,
    });

    this.setState(() => ({
      message: '',
    }));
    if (callback) {
      callback();
    }
  };

  handleTextAreaChange = evt => {
    const { value } = evt.target;
    this.setState(() => ({
      message: value,
    }));
  };

  render() {
    const { message } = this.state;
    return (
      <form className="d-flex flex-column" onSubmit={this.handleSendMessage}>
        <textarea
          value={this.state.message}
          onChange={this.handleTextAreaChange}
        />
        <button type="submit" disabled={message.length === 0}>
          Send
        </button>
      </form>
    );
  }
}

ChatBoxForm.propTypes = {
  socket: PropTypes.object.isRequired,
  room: PropTypes.string,
  loggedUser: PropTypes.object.isRequired,
  receiver: PropTypes.object.isRequired,
  callback: PropTypes.func,
};

ChatBoxForm.defaultProps = {
  room: null,
  callback: null,
};

export default ChatBoxForm;
