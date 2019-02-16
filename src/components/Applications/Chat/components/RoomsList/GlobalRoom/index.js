import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './index.css';

class GlobalRoom extends React.Component {
  state = {
    isCollapsed: true,
  };

  handleToggleList = () => {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  };

  render() {
    const {
      title,
      rooms,
      callback,
      selectedRoom,
      deleteRoom,
      loggedUser,
    } = this.props;
    console.log(this.props);
    const { isCollapsed } = this.state;
    return (
      <Fragment>
        <li
          className="global-room"
          onClick={this.handleToggleList}
          onKeyDown={this.handleToggleList}
        >
          <div className="global-room-header">
            {isCollapsed && rooms.length > 0 ? (
              <i className="fas fa-caret-down pointer" />
            ) : (
              <i className="fas fa-caret-right pointer" />
            )}
            <h2>{title}</h2>
          </div>
          <span>{rooms.length}</span>
        </li>

        <ul className="global-room-content">
          {isCollapsed &&
            rooms &&
            rooms.map((globalRoom, index) => {
              return (
                <li
                  key={index}
                  className={`global-room-item ${
                    globalRoom._id === selectedRoom._id
                      ? 'global-room-item-selected'
                      : ''
                  }`}
                >
                  <button
                    className="global-room-item-btn"
                    onClick={() => callback(globalRoom)}
                  >
                    {globalRoom.name}
                  </button>
                  {globalRoom.administrator === loggedUser._id}
                  <button
                    onClick={() => deleteRoom({ roomId: globalRoom._id })}
                  >
                    delete
                  </button>
                </li>
              );
            })}
        </ul>
      </Fragment>
    );
  }
}

GlobalRoom.propTypes = {
  title: PropTypes.string.isRequired,
  rooms: PropTypes.array,
  callback: PropTypes.func.isRequired,
  selectedRoom: PropTypes.object.isRequired,
};

GlobalRoom.defaultProps = {
  rooms: [],
};

export default GlobalRoom;
