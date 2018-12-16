import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import UserIconContainer from '../../../../../../Modules/UserIcon';
import Modal from '../../../../../../Modules/Modal/modal';
import UsersLoaderContainer from '../../../../../../Modules/UserLoader';
import './index.css';
import InputSearch from '../../../containers/RoomsList/PrivateMessageRoom/InputSearch';

const ROOT_URL = process.env.REACT_APP_API;

class PrivateMessageRoom extends Component {
  static propTypes = {
    rooms: PropTypes.object,
    callback: PropTypes.func.isRequired,
    setDefaultRoomAction: PropTypes.func.isRequired,
    fetchRoomsAndUpdateStatus: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    selectedRoom: PropTypes.object,
    defaultRoom: PropTypes.object,
  };

  static defaultProps = {
    rooms: {},
    selectedRoom: {},
    defaultRoom: {},
  };

  state = {
    showNewPrivateMessageModal: false,
    isCollapsed: true,
  };

  handleToggleList = () => {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  };

  handleOpenModal = () => {
    this.setState(() => ({
      showNewPrivateMessageModal: true,
    }));
  };

  handleNewPrivateMessage = ({ user }) => {
    this.hanldeSelectUser(user);
    this.setState(prevState => ({
      showNewPrivateMessageModal: !prevState.showNewPrivateMessageModal,
    }));
  };

  hanldeSelectUser = async user => {
    const { callback, loggedUser, fetchRoomsAndUpdateStatus } = this.props;
    try {
      const { room } = await this._fetchRoomAction(
        user,
        loggedUser,
        this._setError,
      );
      fetchRoomsAndUpdateStatus(room._id, loggedUser._id, true);
      callback(room, user);
      this.setState(() => ({
        search: '',
        isCollapsed: true,
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

  handleCloseModal = () => {
    this.setState(() => ({
      showNewPrivateMessageModal: false,
      showNewRoomFormModal: false,
    }));
  };

  render() {
    const { showNewPrivateMessageModal, isCollapsed } = this.state;
    const {
      rooms,
      callback,
      setDefaultRoomAction,
      fetchRoomsAndUpdateStatus,
      loggedUser,
      selectedRoom,
      defaultRoom,
    } = this.props;
    return (
      <Fragment>
        <li
          className="global-room"
          onClick={this.handleToggleList}
          onKeyDown={this.handleToggleList}
        >
          <div className="global-room-header">
            {isCollapsed &&
            rooms.privateMessages &&
            rooms.privateMessages.length > 0 ? (
              <i className="fas fa-caret-down pointer" />
            ) : (
              <i className="fas fa-caret-right pointer" />
            )}
            <h2>PrivateMessages</h2>
          </div>
          <span>{rooms.privateMessages && rooms.privateMessages.length}</span>
        </li>
        <li>
          <InputSearch
            selectUser={this.hanldeSelectUser}
            openModalAction={this.handleOpenModal}
          />
        </li>
        <ul className="private-message-room-list">
          {isCollapsed &&
            rooms.privateMessages &&
            rooms.privateMessages.map(privateMessage => (
              <li
                key={privateMessage._id}
                className={`private-message-room-item ${
                  privateMessage._id === selectedRoom._id
                    ? 'private-message-room-item-selected'
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
                  onClick={() => {
                    callback(defaultRoom);
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
            ))}
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
      </Fragment>
    );
  }
}

export default PrivateMessageRoom;
