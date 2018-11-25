import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Button from '../../../../Form/button';

class SendRoomMessageForm extends React.Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    room: PropTypes.object,
    receiver: PropTypes.object,
  };

  static defaultProps = {
    room: null,
    receiver: null,
  };

  state = {
    message: '',
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const { loggedUser, socket, room, receiver } = this.props;

    socket.emit('NEW_MESSAGE', {
      room,
      sender: loggedUser._id,
      message: this.state.message,
    });

    socket.emit('NEW_NOTIFICATION', {
      sender: loggedUser._id,
      message: this.state.message,
      receiver: receiver && receiver,
      type: 'message',
      room,
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

  handleFocus = () => {
    const { loggedUser, socket, room } = this.props;
    socket.emit('IS_TYPING_MESSAGE', {
      room,
      sender: {
        _id: loggedUser._id,
        fullName: loggedUser.fullName,
        picture: loggedUser.picture,
      },
    });
  };

  handleBlur = () => {
    const { socket, room } = this.props;
    socket.emit('STOP_TYPING_MESSAGE', {
      room,
    });
  };

  render() {
    return (
      <form
        className="send-room-message-form"
        onSubmit={evt => this.handleSubmit(evt)}
      >
        <input
          onChange={this.handleTextAreaChange}
          value={this.state.message}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />

        <Button type="submit" label="Send" />
      </form>
    );
  }
}

export default SendRoomMessageForm;
