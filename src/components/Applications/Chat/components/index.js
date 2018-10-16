import React from 'react';
import PropTypes from 'prop-types';
import MessageList from '../containers/MessagesList';
import './index.css';
import SendRoomMessageForm from './SendRoomMessageForm';
import ConnectedUserList from '../containers/ConnectedUserList';
import RoomsListContainer from '../containers/RoomsList';
import Utils from '../../../../Utils/utils';
import SocketStatus from './SoketStatus';

const utils = new Utils();

class Chat extends React.Component {
  static propTypes = {
    room: PropTypes.object,
    fetchRoomAction: PropTypes.func.isRequired,
    globalProps: PropTypes.object.isRequired,
    fetchRoomsAction: PropTypes.func.isRequired,
    updateMessageSuccessAction: PropTypes.func.isRequired,
    newMessageSuccessAction: PropTypes.func.isRequired,
    newReplySuccessAction: PropTypes.func.isRequired,
    deleteMessageSuccessAction: PropTypes.func.isRequired,
    roomsFetchProcess: PropTypes.object.isRequired,
  };

  static defaultProps = {
    room: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
      showRoomList: true,
      smallSize: false,
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
    const {
      fetchRoomsAction,
      room,
      globalProps: { socketIo },
      updateMessageSuccessAction,
      newMessageSuccessAction,
      deleteMessageSuccessAction,
      newReplySuccessAction,
    } = this.props;
    fetchRoomsAction();
    this.addRoomToState(room);
    this.setInitialRoomListView();
    window.addEventListener('resize', this.setInitialRoomListView, false);
    socketIo.on('START_PRIVATE_CHAT', () => {});
    socketIo.on('NEW_MESSAGE_SUCCESS', ({ message }) => {
      newMessageSuccessAction(message);
    });
    socketIo.on('UPDATE_MESSAGE_SUCCESS', ({ message }) => {
      updateMessageSuccessAction(message);
    });
    socketIo.on('MESSAGE_DELETE_SUCCESS', ({ message }) => {
      deleteMessageSuccessAction(message);
    });
    socketIo.on('NEW_REPLY_SUCCESS', ({ reply }) => {
      newReplySuccessAction(reply);
    });
    socketIo.on('UPDATE_REPLY_SUCCESS', ({ reply }) => {
      updateMessageSuccessAction(reply);
    });
    socketIo.on('REPLY_DELETE_SUCCESS', ({ reply }) => {
      updateMessageSuccessAction(reply);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => null, true);
  }
  setInitialRoomListView = () => {
    if (window.matchMedia('(max-width:500px)').matches) {
      this.setState(() => ({
        showRoomList: false,
        smallSize: true,
      }));
    } else {
      this.setState(() => ({
        showRoomList: true,
        smallSize: false,
      }));
    }
  };

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
    this.setState(prevState => ({
      room,
      receiver,
      showRoomList: prevState.smallSize ? false : true,
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

  handleShowRoomList = () => {
    this.setState(prevState => ({
      showRoomList: !prevState.showRoomList,
    }));
  };
  handleHideRoomList = () => {
    this.setState(() => ({
      showRoomList: false,
    }));
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
      globalProps: { socketIo, loggedUser, socketStatus },
    } = this.props;
    const { room, receiver, showRoomList, smallSize } = this.state;
    return (
      <div className="full-height">
        <SocketStatus status={socketStatus} />
        <div className="chat">
          {rooms &&
            showRoomList && (
              <RoomsListContainer
                rooms={rooms}
                callback={this.handleSelectRoom}
                loggedUser={loggedUser}
                smallSize={smallSize}
                closeRoomAction={this.handleShowRoomList}
                selectedRoom={room}
              />
            )}
          <div className="chat-content">
            <div className="d-flex">
              {smallSize && (
                <button onClick={this.handleShowRoomList}>X</button>
              )}
              <h1>{this.roomTitle(room)}</h1>
            </div>
            <MessageList socket={socketIo} loggedUser={loggedUser} />
            <SendRoomMessageForm
              loggedUser={loggedUser}
              receiver={receiver}
              room={room}
              socket={socketIo}
            />
          </div>
          {!smallSize && (
            <div className="connected-user">
              <h1>Connected User</h1>
              <ConnectedUserList />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Chat;
