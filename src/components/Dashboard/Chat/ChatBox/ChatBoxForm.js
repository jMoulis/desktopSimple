import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { addRoomToStateAction } from '../../../../store/reducers/chatReducer';
import { hidePrivateRoomSuccessAction } from '../../../../store/reducers/authReducer';

const ROOT_URL = process.env.REACT_APP_API;
const mapStateToProps = ({ chatReducer }) => ({
  roomFetchProcess: chatReducer.roomFetchProcess,
});

const dispatchStateToProps = dispatch => ({
  addRoomAction: room => {
    dispatch(addRoomToStateAction(room));
  },
  hidePrivateRoomSuccessAction: room => {
    dispatch(hidePrivateRoomSuccessAction(room));
  },
});

class ChatBoxForm extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    receiver: PropTypes.object.isRequired,
    callback: PropTypes.func,
  };

  static defaultProps = {
    callback: null,
  };

  state = {
    message: '',
    room: {},
  };

  async componentDidMount() {
    const {
      loggedUser,
      receiver,
      socket,
      addRoomAction,
      hidePrivateRoomSuccessAction,
    } = this.props;
    try {
      const { room, rooms } = await this._fetchRoomAction(
        receiver,
        loggedUser,
        this._setError,
      );
      console.log('ChatBox', room);
      this._addRoomToState(room);
      hidePrivateRoomSuccessAction({ rooms });
      addRoomAction(room);

      await this._handleJoinRequest(
        {
          room: room._id,
          receiver: {
            _id: receiver._id,
            fullName: receiver.fullName,
          },
        },
        socket,
        this._setError,
      );
    } catch (error) {
      this._setError(error.message);
    }
  }
  _addRoomToState = room => this.setState(() => ({ room }));

  handleSendMessage = evt => {
    evt.preventDefault();
    const { socket, loggedUser, receiver, callback } = this.props;
    const { room } = this.state;
    socket.emit('NEW_MESSAGE', {
      room: room._id,
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
        data: { room, rooms },
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
        room,
        rooms,
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

const createContainer = connect(
  mapStateToProps,
  dispatchStateToProps,
);
const ChatBoxFormContainer = createContainer(ChatBoxForm);

export default ChatBoxFormContainer;
