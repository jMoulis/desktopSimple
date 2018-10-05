import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './index.css';
import UserIconContainer from '../../../../../Modules/UserIcon';
import SelectUserPanel from './SelectUserPanel';

const ROOT_URL = process.env.REACT_APP_API;
class RoomsList extends React.Component {
  static propTypes = {
    rooms: PropTypes.object,
    callback: PropTypes.func.isRequired,
    fetchRoomsAndUpdateStatus: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };

  static defaultProps = {
    rooms: {},
  };

  constructor(props) {
    super(props);
    this.searchFormContainer = React.createRef();
    this.state = {
      search: '',
      users: [],
      showSelectSearch: false,
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

  _setError = message => this.setState(() => ({ error: message }));

  render() {
    const {
      rooms,
      callback,
      loggedUser,
      fetchRoomsAndUpdateStatus,
    } = this.props;
    return (
      <div className="room">
        <h1>Rooms</h1>
        <ul className="room-list">
          <li className="room-list-item">
            <ul>
              <li>
                <h2>#Global</h2>
              </li>
              {rooms.globalRooms &&
                rooms.globalRooms.map((globalRoom, index) => (
                  <li key={index}>
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
                  <li key={index}>
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
                  <li key={privateRoom._id}>
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
                      onClick={() =>
                        fetchRoomsAndUpdateStatus(
                          privateRoom._id,
                          loggedUser._id,
                          false,
                        )
                      }
                    >
                      X
                    </button>
                  </li>
                ))}
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

export default RoomsList;
