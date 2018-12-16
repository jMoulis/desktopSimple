import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Button from '../../../../Form/button';
import { withSocket } from '../../../../../Modules/Socket/SocketProvider';

class SendRoomMessageForm extends React.Component {
  static propTypes = {
    loggedUser: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    socketProvider: PropTypes.object.isRequired,
    room: PropTypes.object,
    receiver: PropTypes.object,
  };

  static defaultProps = {
    room: null,
    receiver: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
    this.inputRef = React.createRef();
  }

  handleSubmit = evt => {
    evt.preventDefault();
    const {
      loggedUser,
      room,
      receiver,
      socketProvider: {
        socketActions: { createNewMessage, sendNewNotification },
      },
    } = this.props;

    createNewMessage({
      room,
      sender: loggedUser._id,
      message: this.state.message,
    });

    sendNewNotification({
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
    const { loggedUser, room, socketProvider } = this.props;
    socketProvider.socketActions.emitTypingAction({ room, loggedUser });
  };

  handleBlur = () => {
    const { room, socketProvider } = this.props;
    socketProvider.socketActions.emitTypingStop({ room });
  };

  render() {
    return (
      <form
        className="send-room-message-form"
        onSubmit={evt => this.handleSubmit(evt)}
      >
        <input
          ref={this.inputRef}
          onChange={this.handleTextAreaChange}
          value={this.state.message}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        <Button type="submit" label="Send" disabled={!this.state.message} />
      </form>
    );
  }
}

export default withSocket(SendRoomMessageForm);
