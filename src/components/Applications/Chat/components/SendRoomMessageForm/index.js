import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

class SendRoomMessageForm extends React.Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    room: PropTypes.object,
  };

  static defaultProps = {
    room: null,
  };

  state = {
    message: '',
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const { loggedUser, socket, room } = this.props;
    socket.emit('ROOM_MESSAGE', {
      room,
      sender: loggedUser._id,
      message: this.state.message,
    });
    this.setState(() => ({
      message: '',
    }));
  };
  handleTextAreaChange = evt => {
    const { value } = evt.target;
    this.setState(() => ({
      message: value,
    }));
  };
  render() {
    return (
      <form
        className="send-room-message-form"
        onSubmit={evt => this.handleSubmit(evt)}
      >
        <textarea onChange={this.handleTextAreaChange} />
        <button type="submit">Send</button>
      </form>
    );
  }
}

export default SendRoomMessageForm;
