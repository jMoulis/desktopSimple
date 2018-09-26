import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import UserIconContainer from '../../../../../Modules/UserIcon';

class RoomsList extends React.Component {
  handleCallbackUserIcon = user => {
    console.log(user);
  };
  groupBy = arrayObjects => {
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
      if (room.isTeamRoom) {
        teamRooms.rooms.push(room);
      } else if (room.isPrivateMessage) {
        privateRooms.rooms.push(room);
      } else {
        globalRooms.rooms.push(room);
      }
    });
    return [teamRooms, privateRooms, globalRooms];
  };
  render() {
    const { rooms, callback, loggedUser } = this.props;
    return (
      <div className="room">
        <h1>Rooms</h1>
        <ul className="room-list">
          <li>
            {this.groupBy(rooms).map(room => {
              return (
                <div key={room.name}>
                  <h2>{room.name}</h2>
                  <ul>
                    {room.rooms.map((item, index) => {
                      if (item.users && !item.name) {
                        return (
                          <UserIconContainer
                            key={item._id}
                            user={{
                              user: item.users.find(
                                user => user && user._id !== loggedUser._id,
                              ),
                            }}
                            callback={user => callback(item, user)}
                            name
                          />
                        );
                      }
                      return (
                        <button key={index} onClick={() => callback(item)}>
                          {item.name}
                        </button>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </li>
        </ul>
      </div>
    );
  }
}

RoomsList.propTypes = {
  rooms: PropTypes.array,
  callback: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
};

RoomsList.defaultProps = {
  rooms: [],
};

export default RoomsList;
