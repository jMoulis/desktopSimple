import React from 'react';
import PropTypes from 'prop-types';
import MessageList from '../containers/MessagesList';
import './index.css';
import SendRoomMessageForm from './SendRoomMessageForm';
import ConnectedUserList from '../containers/ConnectedUserList';
import RoomsListContainer from '../containers/RoomsList';
import Utils from '../../../../Utils/utils';

const utils = new Utils();

class Chat extends React.Component {
  static propTypes = {
    room: PropTypes.object,
    fetchRoomAction: PropTypes.func.isRequired,
    newRoomMessageSuccessAction: PropTypes.func.isRequired,
    globalProps: PropTypes.object.isRequired,
    fetchRoomsAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    roomsFetchProcess: PropTypes.object.isRequired,
  };

  static defaultProps = {
    room: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.room && utils.isObjectEmpty(state.room)) {
      return {
        ...state,
        room: props.room,
      };
    }
    return {
      ...state,
    };
  }

  componentDidMount() {
    const { fetchRoomsAction, newRoomMessageSuccessAction, room } = this.props;
    fetchRoomsAction();
    this.props.globalProps.socketIo.on(
      'NEW_ROOM_MESSAGE_SUCCESS',
      newRoomMessageSuccessAction,
    );
    this.addRoomToState(room);
  }

  addRoomToState = room => this.setState(() => ({ room }));

  handleSelectRoom = async (room, receiver) => {
    const { fetchRoomAction, globalProps } = this.props;
    try {
      fetchRoomAction(room._id);
      if (receiver) {
        this._handleJoinPrivateMessageRequest(
          {
            room: room._id,
            receiver,
          },
          globalProps.socketIo,
          this._setError,
        );
      }
    } catch (error) {
      this._setError(error.message);
    }
    this.setState(() => ({
      room,
    }));
  };

  _setError = message => this.setState(() => ({ error: message }));

  _handleJoinPrivateMessageRequest = async (data, socket, error) => {
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

  roomTitle = room => {
    if (!room || Object.keys(room).length === 0) return 'GENERAL';
    if (room.isPrivateMessage) {
      return room.users.map(user => user.fullName).join(' # ');
    }
    return room.name;
  };

  render() {
    const {
      roomsFetchProcess: { rooms },
      loggedUser,
      globalProps: { socketIo },
    } = this.props;
    const { room } = this.state;
    return (
      <div className="chat">
        {rooms && (
          <RoomsListContainer
            rooms={rooms}
            callback={this.handleSelectRoom}
            loggedUser={loggedUser}
          />
        )}
        <div className="chat-content">
          <h1>{this.roomTitle(room)}</h1>
          <MessageList socket={socketIo} loggedUser={loggedUser} />
          <SendRoomMessageForm
            loggedUser={loggedUser}
            room={room}
            socket={socketIo}
          />
        </div>
        <div className="connected-user">
          <h1>Connected User</h1>
          <ConnectedUserList />
        </div>
      </div>
    );
  }
}

export default Chat;
