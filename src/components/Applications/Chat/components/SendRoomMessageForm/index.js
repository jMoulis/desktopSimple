import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Button from '../../../../Form/button';

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
        <input
          onChange={this.handleTextAreaChange}
          value={this.state.message}
        />
        <Button type="submit" label="Send" />
      </form>
    );
  }
}

export default SendRoomMessageForm;
