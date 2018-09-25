import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import './index.css';

class RoomsList extends Component {
  render() {
    const { rooms, callback } = this.props;
    return (
      <div className="room">
        <h1>Rooms</h1>
        <ul className="room-list">
          {rooms.map(room => (
            <li key={room._id}>
              <button onClick={() => callback(room)}>{room.name}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

RoomsList.propTypes = {};

export default RoomsList;
