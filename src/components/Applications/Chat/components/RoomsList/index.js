import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import UserIconContainer from '../../../../../Modules/UserIcon';

class RoomsList extends React.Component {
  static propTypes = {
    rooms: PropTypes.array,
    callback: PropTypes.func.isRequired,
    hidePrivateRoomAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };

  static defaultProps = {
    rooms: [],
  };

  groupByAndFilter = (arrayObjects, loggedUserRooms) => {
    const teamRooms = {
      name: 'teamRoom',
      rooms: [],
    };

    const privateRooms = {
      name: 'privateRoom',
      rooms: [],
    };

    const globalRooms = {
      name: 'global',
      rooms: [],
    };
    arrayObjects.forEach(room => {
      const loggedUserActiveRoom = loggedUserRooms.find(
        userRoom => userRoom._id === room._id,
      );

      if (room.isTeamRoom) {
        teamRooms.rooms.push(room);
      } else if (
        room.isPrivateMessage &&
        loggedUserActiveRoom &&
        loggedUserActiveRoom.isDisplay
      ) {
        privateRooms.rooms.push(room);
      } else if (!room.isPrivate) {
        globalRooms.rooms.push(room);
      }
    });

    return [teamRooms, privateRooms, globalRooms];
  };

  render() {
    const { rooms, callback, loggedUser, hidePrivateRoomAction } = this.props;
    return (
      <div className="room">
        <h1>Rooms</h1>
        <ul className="room-list">
          {this.groupByAndFilter(rooms, loggedUser.rooms).map(room => (
            <li className="room-list-item" key={room.name}>
              <h2>{`#${room.name}`}</h2>
              <ul>
                {room.rooms.map((roomDetail, index) => {
                  if (roomDetail.users && !roomDetail.name) {
                    return (
                      <li key={roomDetail._id}>
                        <UserIconContainer
                          user={{
                            user: roomDetail.users.find(
                              user => user && user._id !== loggedUser._id,
                            ),
                          }}
                          callback={user => callback(roomDetail, user)}
                          name
                        />
                        <button
                          style={{
                            top: 0,
                            right: 0,
                          }}
                          onClick={() =>
                            hidePrivateRoomAction(
                              roomDetail._id,
                              loggedUser._id,
                              false,
                            )
                          }
                        >
                          X
                        </button>
                      </li>
                    );
                  }
                  return (
                    <button key={index} onClick={() => callback(roomDetail)}>
                      {roomDetail.name}
                    </button>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default RoomsList;
