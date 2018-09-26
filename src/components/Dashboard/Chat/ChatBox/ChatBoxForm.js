import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const ROOT_URL = process.env.REACT_APP_API;

class ChatBoxForm extends Component {
  state = {
    message: '',
  };

  async componentDidMount() {
    const { loggedUser, receiver, socket } = this.props;
    try {
      const room = await this._fetchRoomAction(
        receiver,
        loggedUser,
        this._setError,
      );
      this._addNewRoomToState(room);
      await this._handleJoinRequest(room, socket, this._setError);
    } catch (error) {
      this._setError(error.message);
    }
  }

  _addNewRoomToState = ({ room }) => {
    this.setState(() => ({ room }));
  };

  handleSendMessage = evt => {
    evt.preventDefault();
    const { socket, loggedUser, receiver, callback } = this.props;
    const { room } = this.state;

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

  _fetchRoomAction = async (receiver, user, error) => {
    try {
      const {
        data: { room },
      } = await axios({
        method: 'get',
        url: `${ROOT_URL}/api/rooms/room?receiver=${receiver._id}&sender=${
          user._id
        }`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      return {
        room: room._id,
        receiver: {
          _id: receiver._id,
          fullName: receiver.fullName,
        },
      };
    } catch (err) {
      error(error.message);
    }
  };

  _setError = message => this.setState(() => ({ error: message }));

  handleTextAreaChange = evt => {
    const { value } = evt.target;
    this.setState(() => ({
      message: value,
    }));
  };

  _handleJoinRequest = async (data, socket, error) => {
    try {
      if (!data) throw Error('No Room found');
      socket.emit('JOIN_PRIVATE_REQUEST', socket.id, data);
    } catch (err) {
      error({
        error: {
          message: err.message,
          title: 'Join',
        },
      });
    }
  };

  render() {
    const { message } = this.state;
    const { style, column } = this.props;
    return (
      <form
        style={style}
        className={`d-flex ${column ? 'flex-column' : ''}`}
        onSubmit={this.handleSendMessage}
      >
        <textarea
          className="full-width"
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
  loggedUser: PropTypes.object.isRequired,
  receiver: PropTypes.object.isRequired,
  callback: PropTypes.func,
};

ChatBoxForm.defaultProps = {
  callback: null,
};

export default ChatBoxForm;
