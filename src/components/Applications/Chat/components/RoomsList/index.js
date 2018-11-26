import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../../Modules/Modal/modal';
import NewRoomForm from './NewRoomForm';
import Button from '../../../../Form/button';
import PrivateMessageRoom from '../../containers/RoomsList/PrivateMessageRoom';
import './index.css';
import GlobalRoom from './GlobalRoom';
import NotificationRoom from './NotificationRoom';

class RoomsList extends React.Component {
  static propTypes = {
    rooms: PropTypes.object,
    callback: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    smallSize: PropTypes.bool,
    closeRoomAction: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
    selectedRoom: PropTypes.object,
    notifications: PropTypes.array,
  };

  static defaultProps = {
    rooms: {},
    smallSize: false,
    selectedRoom: {},
    notifications: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      showNewRoomFormModal: false,
    };
  }

  _setError = message => this.setState(() => ({ error: message }));

  handleCloseModal = () => {
    this.setState(() => ({
      showNewPrivateMessageModal: false,
      showNewRoomFormModal: false,
    }));
  };

  handleCreateRoom = () => {
    this.setState(() => ({
      showNewRoomFormModal: true,
    }));
  };

  handleNewRoomSubmit = ({ form, roomReceivedRequest }, callback) => {
    const { socket, loggedUser } = this.props;
    console.log(form);
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
  };

  render() {
    const {
      rooms,
      callback,
      loggedUser,
      smallSize,
      closeRoomAction,
      selectedRoom,
      notifications,
      socket,
    } = this.props;
    const { showNewRoomFormModal } = this.state;
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
          <NotificationRoom
            notifications={notifications}
            socket={socket}
            loggedUser={loggedUser}
          />
        )}
        <ul className="room-list">
          <li
            style={{
              padding: '.5rem',
            }}
          >
            <ul>
              <GlobalRoom
                title="GlobalRooms"
                rooms={rooms.globalRooms}
                callback={callback}
                selectedRoom={selectedRoom}
              />
              <GlobalRoom
                title="TeamsRooms"
                rooms={rooms.teamRooms}
                callback={callback}
                selectedRoom={selectedRoom}
              />
              <GlobalRoom
                title="PrivateRooms"
                rooms={rooms.privateRooms}
                callback={callback}
                selectedRoom={selectedRoom}
              />
              <PrivateMessageRoom
                rooms={rooms}
                callback={callback}
                loggedUser={loggedUser}
                selectedRoom={selectedRoom}
              />
            </ul>
          </li>
        </ul>
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
