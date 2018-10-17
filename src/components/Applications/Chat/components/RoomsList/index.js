import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './index.css';
import UserIconContainer from '../../../../../Modules/UserIcon';
import SelectUserPanel from './SelectUserPanel';
import Modal from '../../../../../Modules/Modal/modal';
import UsersLoaderContainer from '../../../../../Modules/UserLoader';

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
    selectedRoom: PropTypes.object,
    defaultRoom: PropTypes.object,
  };

  static defaultProps = {
    rooms: {},
    smallSize: false,
    selectedRoom: {},
    defaultRoom: {},
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
    const { room } = await this._fetchRoomAction(
      user,
      loggedUser,
      this._setError,
    );
    fetchRoomsAndUpdateStatus(room._id, loggedUser._id, true);
    callback(room, user);
    this.setState(() => ({
      showSelectSearch: false,
    }));
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
      error(error.message);
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
    }));
  };
  handleOpenModal = () => {
    this.setState(() => ({
      showNewPrivateMessageModal: true,
    }));
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
    } = this.props;
    const { showNewPrivateMessageModal } = this.state;
    return (
      <div className="room">
        {smallSize && <button onClick={closeRoomAction}>X</button>}
        <h1>Rooms</h1>
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
                <h2>#Private</h2>
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
              {rooms.privateRooms &&
                rooms.privateRooms.map(privateRoom => (
                  <li
                    key={privateRoom._id}
                    className={`room-list-item ${
                      privateRoom._id === selectedRoom._id
                        ? 'room-list-item-selected'
                        : ''
                    }`}
                  >
                    <UserIconContainer
                      user={{
                        user: privateRoom.users.find(
                          user => user && user._id !== loggedUser._id,
                        ),
                      }}
                      callback={user => callback(privateRoom, user)}
                      name
                      shouldUpdateNotification
                    />
                    <button
                      style={{
                        top: 0,
                        right: 0,
                      }}
                      onClick={() => {
                        callback(defaultRoom);
                        setDefaultRoomAction();
                        fetchRoomsAndUpdateStatus(
                          privateRoom._id,
                          loggedUser._id,
                          false,
                        );
                      }}
                    >
                      X
                    </button>
                  </li>
                ))}
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
      </div>
    );
  }
}

export default RoomsList;
