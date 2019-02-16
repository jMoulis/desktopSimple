import React from 'react';
import PropTypes from 'prop-types';
import MessageList from '../containers/MessagesList';
import './index.css';
import SendRoomMessageForm from './SendRoomMessageForm';
import ConnectedUserList from '../containers/ConnectedUserList';
import RoomsListContainer from '../containers/RoomsList';
import Utils from '../../../../Utils/utils';
import SocketStatus from '../../../../Modules/Socket/SoketStatus';
import Button from '../../../Form/button';
import Modal from '../../../../Modules/Modal/modal';
import AddUserForm from './MessagesList/AddUserForm/AddUserForm';
import UsersThumbnailList from './UsersThumbnailList/UsersThumbnailList';
import { withSocket } from '../../../../Modules/Socket/SocketProvider';

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
    socketProvider: PropTypes.object.isRequired,
    fetchRoomsSuccessAction: PropTypes.func.isRequired,
    fetchNotificationsSuccessAction: PropTypes.func.isRequired,
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
        isTyping: false,
      },
    };
    this.utils = new Utils();
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
      updateMessageSuccessAction,
      newMessageSuccessAction,
      deleteMessageSuccessAction,
      newReplySuccessAction,
      socketProvider: {
        socketActions: {
          onNewMessageSuccess,
          onUpdateMessageSuccess,
          onDeleteMessageSuccess,
          onNewRoomSuccess,
          onReplySuccess,
          onReplyUpdateSuccess,
          onStopTypingSuccess,
          onTypingSuccessAction,
          onReplyDeleteSuccess,
          onRequestRoomAcceptSuccess,
        },
      },
      fetchRoomsSuccessAction,
      fetchNotificationsSuccessAction,
    } = this.props;

    fetchRoomsAction();
    this.addRoomToState(room);
    this.setInitialRoomListView();

    window.addEventListener('resize', this.setInitialRoomListView, false);

    onNewMessageSuccess(newMessageSuccessAction);
    onDeleteMessageSuccess(deleteMessageSuccessAction);
    onReplySuccess(newReplySuccessAction);

    onUpdateMessageSuccess(updateMessageSuccessAction);
    onReplyUpdateSuccess(updateMessageSuccessAction);
    onReplyDeleteSuccess(updateMessageSuccessAction);

    onTypingSuccessAction(this.typingStatus);
    onStopTypingSuccess(this.typingStatus);

    onNewRoomSuccess(fetchRoomsSuccessAction);

    onRequestRoomAcceptSuccess(
      fetchNotificationsSuccessAction,
      fetchRoomsSuccessAction,
    );
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

  typingStatus = (sender, typingUsers, room, isTyping) =>
    this.setState(() => ({
      typingStatus: {
        sender,
        typingUsers,
        room,
        isTyping,
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
        showRoomList: !prevState.smallSize,
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

  roomTitle = room => {
    if (!room || Object.keys(room).length === 0) return 'No room selected';
    if (room.isPrivateMessage) {
      return room.users.map(user => user.fullName).join(' # ');
    }
    return room.name;
  };

  handlShowUserSelector = () =>
    this.setState(prevState => ({
      showUserSelector: !prevState.showUserSelector,
    }));

  handleUserSelect = ({ roomReceivedRequest: usersToAddRoomRequest }) => {
    const {
      globalProps: { loggedUser },
      socketProvider: { socketActions },
    } = this.props;
    try {
      socketActions.addUserToRoom(
        usersToAddRoomRequest,
        this.state.room,
        loggedUser,
      );
      this.setState(() => ({
        showUserSelector: false,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {
      roomsFetchProcess: { rooms },
      globalProps: { loggedUser },
      socketProvider: { socketStatus, socket },
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
                socket={socket}
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
              socket={socket}
              loggedUser={loggedUser}
              typingStatus={typingStatus}
            />
            <SendRoomMessageForm
              loggedUser={loggedUser}
              receiver={receiver}
              room={room}
              socket={socket}
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

export default withSocket(Chat);
