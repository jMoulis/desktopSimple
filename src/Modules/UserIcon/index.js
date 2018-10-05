import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

// Action from global app... I think it might be a little spaghetti code
import { showUserDetailModalAction } from '../../store/reducers/appReducer';
import { updateNotificationsAction } from '../../store/reducers/notificationsReducer';
import BadgeNotifications from '../../components/Dashboard/Footer/BadgeNotifications';
import Utils from '../../Utils/utils';

const ROOT_URL = process.env.REACT_APP_API;

const mapStateToProps = ({
  notificationsReducer,
  chatReducer,
  authReducer,
}) => ({
  notifications: notificationsReducer.notifications,
  room: chatReducer.roomFetchProcess.room,
});

const mapDispatchToProps = dispatch => ({
  showUserDetailModal: userId => {
    dispatch(showUserDetailModalAction(userId));
  },
  updateNotificationsAction: userId => {
    dispatch(updateNotificationsAction(userId));
  },
});

class UserIcon extends React.Component {
  static propTypes = {
    showUserDetailModal: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classCss: PropTypes.string,
    containerCss: PropTypes.object,
    active: PropTypes.bool,
    name: PropTypes.bool,
    hideNotificationBadge: PropTypes.bool,
    shouldUpdateNotification: PropTypes.bool,
    callback: PropTypes.func,
  };
  static defaultProps = {
    active: true,
    classCss: '',
    containerCss: null,
    name: false,
    callback: null,
    hideNotificationBadge: false,
    shouldUpdateNotification: false,
  };
  hasNotifications = (notifications, { user }) => {
    const filteredNotif = notifications.filter(
      notification =>
        notification.sender === user._id &&
        !notification.isRead &&
        notification.type === 'message',
    );
    if (filteredNotif.length > 0) {
      return (
        <BadgeNotifications
          style={{
            top: '5px',
            left: '0',
          }}
          count={
            notifications.filter(
              notification =>
                notification.sender === user._id.toString() &&
                !notification.isRead,
            ).length
          }
        />
      );
    }
  };
  render() {
    const {
      showUserDetailModal,
      user,
      active,
      classCss,
      name,
      containerCss,
      callback,
      notifications,
      updateNotificationsAction,
      hideNotificationBadge,
      shouldUpdateNotification,
    } = this.props;
    if (!user.user) {
      return null;
    }
    return (
      <div
        className="d-flex flex-align-items-center user-icon"
        style={containerCss}
        onClick={() => {
          if (callback) {
            callback(user.user);
          }
          if (shouldUpdateNotification) {
            updateNotificationsAction({
              type: 'message',
              sender: user.user._id,
            });
          }
        }}
        onKeyPress={() => {
          if (callback) {
            callback(user.user);
          }
          if (shouldUpdateNotification) {
            updateNotificationsAction({
              type: 'message',
              sender: user.user._id,
            });
          }
        }}
        data-value={user.user._id}
      >
        <img
          className={`mini-thumbnail mini-thumbnail-${classCss}`}
          src={`${ROOT_URL}${user.user.picture}` || '/img/avatar.png'}
          alt="Student"
          title={`${user.user.fullName} ${user.spec ? `- ${user.spec}` : ''}`}
          onClick={() => active && showUserDetailModal(user.user._id)}
          onKeyPress={() => active && showUserDetailModal(user.user._id)}
          style={
            user.spec === 'manager'
              ? {
                  border: '2px solid #d44c00',
                }
              : {
                  border: '2px solid transparent',
                }
          }
        />
        {!hideNotificationBadge && this.hasNotifications(notifications, user)}
        {name && <span>{user.user.fullName}</span>}
      </div>
    );
  }
}

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const UserIconContainer = createContainer(UserIcon);

export default UserIconContainer;
