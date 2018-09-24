import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ChatBox from './ChatBox';
import './index.css';
import RoomList from './RoomList';

const ROOT_URL = process.env.REACT_APP_API;

class Chat extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    props.socket.on('START_PRIVATE_CHAT', () => {});
    props.socket.on('NEW_MESSAGE_SUCCESS', this.handleMessageSuccess);
    this.state = {
      rooms: [],
      receiver: null,
      socketIds: [],
    };
  }

  componentDidUpdate() {
    if (this.props.status === 'reconnect') {
      this.handleJoinRequest({
        receiver: this.state.receiver,
      });
    }
  }

  handleMessageSuccess = ({ message, room }) => {
    const rooms = this.state.rooms.map(actualRoom => {
      if (actualRoom._id === room) {
        return {
          ...actualRoom,
          messages: [...actualRoom.messages, message],
        };
      }
      return actualRoom;
    });
    this.setState(() => ({
      rooms,
    }));
  };

  handleJoinRequest = async receiver => {
    const { user, socket } = this.props;
    const room = await this.fetchRoomAction(receiver, user);
    if (room) {
      this.addRoomToState(room, receiver);

      if (!this.state.socketIds.includes(receiver._id)) {
        this.socketJoinRequest(room._id, receiver, socket);
      }
    }
  };

  fetchRoomAction = async (receiver, user) => {
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
    return room;
  };

  addRoomToState = async (room, receiver) => {
    await this.setState(prevState => {
      const { rooms } = prevState;
      if (rooms.length === 0) {
        rooms.push({
          _id: room._id,
          messages: room.messages,
          users: room.users,
        });
      }
      if (!rooms.find(stateRoom => stateRoom._id === room._id)) {
        rooms.push({
          _id: room._id,
          messages: room.messages,
          users: room.users,
        });
      }

      return {
        receiver,
        rooms,
      };
    });
  };

  socketJoinRequest = (roomId, receiver, socket) =>
    socket.emit(
      'JOIN_PRIVATE_REQUEST',
      socket.id,
      {
        room: roomId,
        receiver: {
          _id: receiver._id,
          fullName: receiver.fullName,
        },
      },
      id =>
        this.setState(prevState => ({
          socketIds: [...prevState.socketIds, id],
        })),
    );

  handleFormSendMessage = () => {
    this.setState(() => ({
      message: 'sent',
    }));
  };

  render() {
    const { user: loggedUser, socket } = this.props;
    const { rooms, receiver } = this.state;
    return (
      <Fragment>
        <div className="chat-box d-flex">
          {rooms.map(room => (
            <ChatBox
              key={room._id}
              room={room}
              socket={socket}
              receiver={receiver}
              loggedUser={loggedUser}
              callback={this.handleFormSendMessage}
            />
          ))}
          <RoomList loggedUser={loggedUser} callback={this.handleJoinRequest} />
        </div>
      </Fragment>
    );
  }
}

export default Chat;
