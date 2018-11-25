import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MessageList from '../containers/MessagesList';
import './index.css';
import SendRoomMessageForm from './SendRoomMessageForm';
import ConnectedUserList from '../containers/ConnectedUserList';
import RoomsListContainer from '../containers/RoomsList';
import Utils from '../../../../Utils/utils';
import SocketStatus from './SoketStatus';
import Button from '../../../Form/button';
import Modal from '../../../../Modules/Modal/modal';
import UsersLoaderContainer from '../../../../Modules/UserLoader';
import SocketActions from '../socketActions';
import NewRoomForm from './RoomsList/NewRoomForm';
import AddUserForm from './MessagesList/AddUserForm/AddUserForm';
import UserIconContainer from '../../../../Modules/UserIcon';
import UsersThumbnailList from './UsersThumbnailList/UsersThumbnailList';

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
      typingStatus: {
        sender: null,
        typingUsers: [],
        room: null,
      },
      usersToAddRoomRequest: [],
    };
    this.utils = new Utils();
    this.socketActions = new SocketActions(props.globalProps.socketIo);
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

    socketIo.on('NEW_MESSAGE_SUCCESS', ({ message }) => {
      newMessageSuccessAction(message);
    });
    socketIo.on('UPDATE_MESSAGE_SUCCESS', ({ message }) => {
      updateMessageSuccessAction(message);
    });
    socketIo.on('DELETE_MESSAGE_SUCCESS', ({ message }) => {
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
    socketIo.on(
      'IS_TYPING_MESSAGE_SUCCESS',
      ({ sender, typingUsers, room }) => {
        this.typingStatus(sender, typingUsers, room);
      },
    );
    socketIo.on('STOP_TYPING_MESSAGE_SUCCESS', ({ typingUsers }) => {
      this.typingStatus(null, typingUsers);
    });
    socketIo.on('NEW_ROOM_SUCCESS', ({ rooms }) => {
      const { fetchRoomsSuccessAction } = this.props;
      fetchRoomsSuccessAction({ rooms });
    });
    socketIo.on('REQUEST_ROOM_ACCEPT_SUCCESS', ({ notifications, rooms }) => {
      const {
        fetchNotificationsSuccessAction,
        fetchRoomsSuccessAction,
      } = this.props;
      fetchNotificationsSuccessAction({ notifications });
      fetchRoomsSuccessAction({ rooms });
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

  typingStatus = (sender, typingUsers, room) =>
    this.setState(() => ({
      typingStatus: {
        sender,
        typingUsers,
        room,
      },
    }));

  addRoomToState = room => this.setState(() => ({ room }));

  handleSelectRoom = async (room, receiver) => {
    const { fetchRoomAction, globalProps } = this.props;
    try {
      fetchRoomAction(room._id);
      this._handleJoinPrivateMessageRequest(
        {
          room: room._id,
        },
        globalProps.socketIo,
        this._setError,
      );
      this.setState(prevState => ({
        room,
        receiver,
        showRoomList: prevState.smallSize ? false : true,
      }));
    } catch (error) {
      this._setError(error.message);
    }
  };

  _setError = message => this.setState(() => ({ error: message }));

  _handleJoinPrivateMessageRequest = async (data, socket, error) => {
    try {
      if (!data) throw Error('No Room found');
      socket.emit('JOIN_PRIVATE_REQUEST', data);
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
    if (!room || Object.keys(room).length === 0) return 'No room selected';
    if (room.isPrivateMessage) {
      return room.users.map(user => user.fullName).join(' # ');
    }
    return room.name;
  };

  handlShowUserSelector = () => {
    return this.setState(prevState => ({
      showUserSelector: !prevState.showUserSelector,
    }));
  };

  handleUserSelect = ({ roomReceivedRequest: usersToAddRoomRequest }) => {
    const {
      globalProps: { loggedUser },
    } = this.props;
    try {
      this.socketActions.addUserToRoom(
        usersToAddRoomRequest,
        this.state.room,
        loggedUser,
      );
      this.setState(() => ({
        showUserSelector: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      roomsFetchProcess: { rooms },
      globalProps: { socketIo, loggedUser, socketStatus },
    } = this.props;
    const {
      room,
      receiver,
      showRoomList,
      smallSize,
      typingStatus,
      showUserSelector,
    } = this.state;
    return (
      <div className="full-height">
        <SocketStatus status={socketStatus} />
        <div className="chat">
          {rooms &&
            showRoomList && (
              <RoomsListContainer
                rooms={rooms}
                socket={socketIo}
                callback={this.handleSelectRoom}
                loggedUser={loggedUser}
                smallSize={smallSize}
                closeRoomAction={this.handleShowRoomList}
                selectedRoom={room}
              />
            )}
          <div className="chat-content">
            <div className="d-flex flex-justify-between flex-align-items-center">
              {smallSize && (
                <button onClick={this.handleShowRoomList}>X</button>
              )}
              <h1>{this.roomTitle(room)}</h1>
              {!this.utils.isObjectEmpty(room) &&
                room.isPrivate &&
                !room.isPrivateMessage &&
                !room.isTeamRoom && (
                  <Button
                    style={{
                      margin: 0,
                      padding: '0 .3rem',
                    }}
                    onClick={this.handlShowUserSelector}
                  >
                    +
                  </Button>
                )}
            </div>

            {!this.utils.isObjectEmpty(room) && (
              <UsersThumbnailList users={room.users} />
            )}

            <MessageList
              socket={socketIo}
              loggedUser={loggedUser}
              typingStatus={typingStatus}
            />
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
        {showUserSelector && (
          <Modal
            closeFromParent={() =>
              this.setState(() => ({
                showUserSelector: false,
              }))
            }
            zIndex={2}
            title="Add a user to the room"
          >
            <AddUserForm
              loggedUser={loggedUser}
              onSubmit={this.handleUserSelect}
            />
          </Modal>
        )}
      </div>
    );
  }
}

export default Chat;
