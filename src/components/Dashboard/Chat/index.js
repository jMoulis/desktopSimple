import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ROOT_URL } from '../../../Utils/config';
import ChatBox from './ChatBox';
import ConversationList from './ConversationList';
import './index.css';

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

  componentDidMount() {
    const { user } = this.props;
    this.fetchConversationsAction(user);
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

  handleJoinRequest = async ({ receiver }) => {
    const { user, socket } = this.props;
    const conversation = await this.fetchConversationAction(receiver, user);
    if (conversation) {
      this.addRoomToState(conversation, receiver);

      if (!this.state.socketIds.includes(receiver._id)) {
        this.socketJoinRequest(conversation._id, receiver, socket);
      }
    }
  };

  fetchConversationAction = async (receiver, user) => {
    const {
      data: { conversation },
    } = await axios({
      method: 'get',
      url: `${ROOT_URL}/api/conversations/conversation?receiver=${
        receiver._id
      }&sender=${user._id}`,
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    });
    return conversation;
  };

  fetchConversationsAction = async user => {
    const {
      data: { conversations },
    } = await axios({
      method: 'get',
      url: `${ROOT_URL}/api/conversations?sender=${user._id}`,
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    });
    this.setState(() => ({
      conversations,
    }));
    return conversations;
  };

  addRoomToState = async (conversation, receiver) => {
    await this.setState(prevState => {
      const { rooms } = prevState;
      if (rooms.length === 0) {
        rooms.push({
          _id: conversation._id,
          messages: conversation.messages,
          users: conversation.users,
        });
      }
      if (!rooms.find(room => room._id === conversation._id)) {
        rooms.push({
          _id: conversation._id,
          messages: conversation.messages,
          users: conversation.users,
        });
      }

      return {
        receiver,
        rooms,
      };
    });
  };

  socketJoinRequest = (conversationId, receiver, socket) =>
    socket.emit(
      'JOIN_REQUEST',
      socket.id,
      {
        room: conversationId,
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
    const { user: loggedUser, socket, close, reduce } = this.props;
    const { rooms, receiver, conversations } = this.state;
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
              close={close}
              reduce={reduce}
            />
          ))}
          <ConversationList
            conversations={conversations}
            loggedUser={loggedUser}
            callback={this.handleJoinRequest}
          />
        </div>
      </Fragment>
    );
  }
}

export default Chat;
