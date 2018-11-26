import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../../Form/button';

class NotificationRoom extends React.Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    notifications: PropTypes.array,
  };

  static defaultProps = {
    notifications: [],
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
    const { notifications } = this.props;
    return (
      <ul>
        {notifications.map((notification, index) => {
          if (notification.type === 'room_request')
            return (
              <li key={index}>
                <h2>#NewRoomRequest</h2>
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
    );
  }
}

export default NotificationRoom;
