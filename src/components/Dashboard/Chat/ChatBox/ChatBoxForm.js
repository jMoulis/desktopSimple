import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  addRoomToStateAction,
  fetchRoomsAndUpdateStatus,
} from '../../../../store/reducers/chatReducer';

const ROOT_URL = process.env.REACT_APP_API;
const mapStateToProps = ({ chatReducer }) => ({
  roomFetchProcess: chatReducer.roomFetchProcess,
});

const dispatchStateToProps = dispatch => ({
  addRoomAction: room => {
    dispatch(addRoomToStateAction(room));
  },
  fetchRoomsAndUpdateStatusAction: (roomId, loggedUserId, status) => {
    dispatch(fetchRoomsAndUpdateStatus(roomId, loggedUserId, status));
  },
});

class ChatBoxForm extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    receiver: PropTypes.object.isRequired,
    callback: PropTypes.func,
    fetchRoomsAndUpdateStatusAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    callback: null,
  };

  state = {
    message: '',
    room: {},
  };

  async componentDidMount() {
    const { loggedUser, receiver, socket } = this.props;
    try {
      const { room } = await this._fetchRoomAction(
        receiver,
        loggedUser,
        this._setError,
      );
      this._addRoomToState(room);
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
  _setError = message => this.setState(() => ({ error: message }));
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
        room,
      };
    } catch (err) {
      error(error.message);
    }
  };

  handleSendMessage = evt => {
    evt.preventDefault();
    const {
      socket,
      loggedUser,
      receiver,
      callback,
      fetchRoomsAndUpdateStatusAction,
    } = this.props;
    const { room } = this.state;

    fetchRoomsAndUpdateStatusAction(room._id, loggedUser._id, true);
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
