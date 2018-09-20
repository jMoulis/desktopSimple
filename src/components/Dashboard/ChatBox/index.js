import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ROOT_URL } from '../../../Utils/config';
import ChatMessageForm from './ChatMessageForm';

class ChatBox extends Component {
  state = {
    rooms: [],
    receiver: null,
  };

  componentDidMount() {
    const { socket } = this.props;
    socket.on('START_PRIVATE_CHAT', this.handleStartChat);
    socket.on('NEW_MESSAGE_SUCCESS', this.handleMessageSuccess);
  }

  handleStartChat = data => {
    console.log('Start Chat response emit', data);
  };

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
    const {
      data: { conversation },
    } = await axios({
      method: 'get',
      url: `${ROOT_URL}/api/conversations?receiver=${receiver._id}&sender=${
        user._id
      }`,
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    });

    this.setState(prevState => {
      return {
        rooms: [
          ...prevState.rooms,
          { _id: conversation._id, messages: conversation.messages },
        ],
      };
    });

    this.setState(() => ({
      receiver,
    }));

    socket.emit('JOIN_REQUEST', socket.id, {
      room: conversation._id,
      receiver: {
        fullName: receiver.fullName,
      },
    });
  };

  render() {
    const { user, socket } = this.props;
    const { rooms, receiver } = this.state;
    return (
      <div className="d-flex">
        <ul>
          {user &&
            user.friends.map((receiver, index) => (
              <li key={index}>
                <button onClick={() => this.handleJoinRequest(receiver)}>
                  {receiver.fullName}
                </button>
              </li>
            ))}
        </ul>
        {rooms.map(room => (
          <div key={room._id}>
            <ul>
              {room.messages.map(({ _id, message }) => (
                <li key={_id}>{message}</li>
              ))}
            </ul>
            <ChatMessageForm
              key={room._id}
              room={room._id}
              socket={socket}
              receiver={receiver}
              user={user}
            />
          </div>
        ))}
      </div>
    );
  }
}

ChatBox.propTypes = {};

export default ChatBox;
