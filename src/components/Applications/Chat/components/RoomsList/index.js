import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './index.css';
import UserIconContainer from '../../../../../Modules/UserIcon';
import SelectUserPanel from './SelectUserPanel';
import Modal from '../../../../../Modules/Modal/modal';
import UsersLoaderContainer from '../../../../../Modules/UserLoader';
import NewRoomForm from './NewRoomForm';
import Button from '../../../../Form/button';

const ROOT_URL = process.env.REACT_APP_API;
class RoomsList extends React.Component {
  static propTypes = {
    rooms: PropTypes.object,
    callback: PropTypes.func.isRequired,
    fetchRoomsAndUpdateStatus: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    smallSize: PropTypes.bool,
    closeRoomAction: PropTypes.func.isRequired,
    setDefaultRoomAction: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
    selectedRoom: PropTypes.object,
    defaultRoom: PropTypes.object,
    notifications: PropTypes.array,
  };

  static defaultProps = {
    rooms: {},
    smallSize: false,
    selectedRoom: {},
    defaultRoom: {},
    notifications: [],
  };

  constructor(props) {
    super(props);
    this.searchFormContainer = React.createRef();
    this.state = {
      search: '',
      users: [],
      showSelectSearch: false,
      hideButtonShow: true,
      showNewPrivateMessageModal: false,
      showNewRoomFormModal: false,
      error: null,
    };
  }

  componentDidUpdate() {
    document.addEventListener('mouseup', evt => {
      const container = document.querySelector('.select-user-list');
      if (this.state.showSelectSearch && !container.contains(evt.target))
        return this.setState(() => ({
          showSelectSearch: false,
        }));
    });
  }

  handleSearch = evt => {
    const { value } = evt.target;
    if (!value)
      return this.setState(() => ({
        users: [],
        search: '',
      }));
    this.setState(
      () => ({
        search: value,
      }),
      () => {
        this.handleSearchSubmit();
      },
    );
  };

  handleSearchSubmit = async () => {
    try {
      const { data } = await axios({
        method: 'get',
        url: `${ROOT_URL}/api/rooms/room/users/?search=${this.state.search}`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      if (data.users.length === 0) {
        return this.setState(() => ({
          users: [],
          showSelectSearch: true,
        }));
      }

      return this.setState(() => ({
        users: data.users,
        showSelectSearch: true,
      }));
    } catch (error) {
      this.setState(() => ({
        users: [],
      }));
    }
  };

  hanldeSelectUser = async user => {
    const { callback, loggedUser, fetchRoomsAndUpdateStatus } = this.props;
    try {
      const { room, error } = await this._fetchRoomAction(
        user,
        loggedUser,
        this._setError,
      );
      fetchRoomsAndUpdateStatus(room._id, loggedUser._id, true);
      callback(room, user);
      this.setState(() => ({
        showSelectSearch: false,
      }));
    } catch (error) {
      console.log(error);
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
        room,
      };
    } catch (err) {
      error(err.message);
    }
  };

  _setError = message => this.setState(() => ({ error: message }));

  handleShowRoomList = () => {
    this.setState(prevState => ({
      hideButtonShow: !prevState.hideButtonShow,
    }));
  };

  handleNewPrivateMessage = ({ user }) => {
    this.hanldeSelectUser(user);
    this.setState(prevState => ({
      showNewPrivateMessageModal: !prevState.showNewPrivateMessageModal,
    }));
  };

  handleCloseModal = () => {
    this.setState(() => ({
      showNewPrivateMessageModal: false,
      showNewRoomFormModal: false,
    }));
  };

  handleOpenModal = () => {
    this.setState(() => ({
      showNewPrivateMessageModal: true,
    }));
  };

  handleCreateRoom = () => {
    this.setState(() => ({
      showNewRoomFormModal: true,
    }));
  };

  handleNewRoomSubmit = ({ form, roomReceivedRequest }, callback) => {
    const { socket, loggedUser } = this.props;
    socket.emit(
      'NEW_ROOM',
      {
        values: form,
        sender: loggedUser._id,
        roomReceivedRequest,
        message: form.name,
        type: 'room_request',
      },
      ({ error }) => {
        if (error) return this._setError(error);
        callback();
      },
    );
    // roomReceivedRequest.forEach(receiver => {
    //   socket.emit('NEW_NOTIFICATION', {
    //     sender: loggedUser._id,
    //     message: 'New Room request',
    //     type: 'room_request',
    //     receiver,
    //   });
    // });
  };

  handleAcceptRequest = ({ room, notificationId }) => {
    const { socket, loggedUser } = this.props;
    socket.emit('REQUEST_ROOM_ACCEPT', {
      senderId: loggedUser._id,
      roomId: room,
      notificationId,
    });
  };

  handleDeclineRequest = ({ room, notificationId }) => {
    const { socket, loggedUser } = this.props;
    socket.emit('REQUEST_ROOM_DECLINE', {
      senderId: loggedUser._id,
      roomId: room,
      notificationId,
    });
  };

  render() {
    const {
      rooms,
      callback,
      loggedUser,
      fetchRoomsAndUpdateStatus,
      smallSize,
      closeRoomAction,
      setDefaultRoomAction,
      selectedRoom,
      defaultRoom,
      notifications,
    } = this.props;
    const { showNewPrivateMessageModal, showNewRoomFormModal } = this.state;
    return (
      <div className="room">
        {smallSize && <button onClick={closeRoomAction}>X</button>}
        <div className="d-flex flex-justify-between">
          <h1>Rooms</h1>
          <Button
            style={{
              margin: 0,
              padding: '0 .3rem',
            }}
            onClick={this.handleCreateRoom}
          >
            +
          </Button>
        </div>
        {notifications.length > 0 && (
          <ul>
            {notifications.map((notification, index) => {
              if (notification.type === 'room_request')
                return (
                  <li key={index}>
                    <div
                      style={{
                        padding: '0.5rem 1rem',
                      }}
                    >
                      {notification.body}
                      <Button
                        small
                        category="success"
                        style={{ margin: 0 }}
                        onClick={() =>
                          this.handleAcceptRequest({
                            room: notification.room,
                            notificationId: notification._id,
                          })
                        }
                      >
                        <i className="fas fa-check-circle" />
                      </Button>
                      <Button
                        small
                        category="danger"
                        style={{ margin: 0 }}
                        onClick={() =>
                          this.handleDeclineRequest({
                            room: notification.room,
                            notificationId: notification._id,
                          })
                        }
                      >
                        <i className="fas fa-ban" />
                      </Button>
                    </div>
                  </li>
                );
              return null;
            })}
          </ul>
        )}
        <ul className="room-list">
          <li
            style={{
              padding: '.5rem',
            }}
          >
            <ul>
              <li>
                <h2>#Global</h2>
              </li>
              {rooms.globalRooms &&
                rooms.globalRooms.map((globalRoom, index) => (
                  <li
                    key={index}
                    className={`room-list-item ${
                      globalRoom._id === selectedRoom._id
                        ? 'room-list-item-selected'
                        : ''
                    }`}
                  >
                    <button
                      className="room-list-item-btn"
                      onClick={() => callback(globalRoom)}
                    >
                      {globalRoom.name}
                    </button>
                  </li>
                ))}
              <li>
                <h2>#Teams</h2>
              </li>
              {rooms.teamRooms &&
                rooms.teamRooms.map((teamRoom, index) => (
                  <li
                    key={index}
                    className={`room-list-item ${
                      teamRoom._id === selectedRoom._id
                        ? 'room-list-item-selected'
                        : ''
                    }`}
                  >
                    <button
                      className="room-list-item-btn"
                      onClick={() => callback(teamRoom)}
                    >
                      {teamRoom.name}
                    </button>
                  </li>
                ))}
              <li>
                <h2>#PrivateRooms</h2>
              </li>
              {rooms.privateRooms &&
                rooms.privateRooms.map((privateRoom, index) => (
                  <li
                    key={index}
                    className={`room-list-item ${
                      privateRoom._id === selectedRoom._id
                        ? 'room-list-item-selected'
                        : ''
                    }`}
                  >
                    <button
                      className="room-list-item-btn"
                      onClick={() => callback(privateRoom)}
                    >
                      {privateRoom.name}
                    </button>
                  </li>
                ))}
              <li>
                <h2>#Private Messages</h2>
              </li>
              <li>
                <div className="room-list-search-form">
                  <input
                    value={this.state.search}
                    onChange={this.handleSearch}
                    placeholder="Search private message"
                  />
                  <button onClick={this.handleOpenModal}>
                    <i className="fas fa-edit" />
                  </button>
                  {this.state.showSelectSearch && (
                    <SelectUserPanel
                      users={this.state.users}
                      callback={this.hanldeSelectUser}
                    />
                  )}
                </div>
              </li>
              {rooms.privateMessages &&
                rooms.privateMessages.map(privateMessage => {
                  return (
                    <li
                      key={privateMessage._id}
                      className={`room-list-item ${
                        privateMessage._id === selectedRoom._id
                          ? 'room-list-item-selected'
                          : ''
                      }`}
                    >
                      <UserIconContainer
                        user={{
                          user: privateMessage.users.find(
                            user => user && user._id !== loggedUser._id,
                          ),
                        }}
                        callback={user => callback(privateMessage, user)}
                        name
                        shouldUpdateNotification
                      />
                      <button
                        style={{
                          top: 0,
                          right: 0,
                        }}
                        onClick={() => {
                          // callback(defaultRoom);
                          // Go back to global Room;
                          setDefaultRoomAction();
                          fetchRoomsAndUpdateStatus(
                            privateMessage._id,
                            loggedUser._id,
                            false,
                          );
                        }}
                      >
                        X
                      </button>
                    </li>
                  );
                })}
            </ul>
          </li>
        </ul>
        {showNewPrivateMessageModal && (
          <Modal
            closeFromParent={this.handleCloseModal}
            zIndex={2}
            title="New Private message"
          >
            <UsersLoaderContainer
              filter={{}}
              select={this.handleNewPrivateMessage}
            />
          </Modal>
        )}
        {showNewRoomFormModal && (
          <Modal
            closeFromParent={this.handleCloseModal}
            zIndex={2}
            title="New Private Room"
          >
            <NewRoomForm
              loggedUser={loggedUser}
              onSubmit={this.handleNewRoomSubmit}
            />
          </Modal>
        )}
      </div>
    );
  }
}

export default RoomsList;
