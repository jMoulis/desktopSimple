import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UserIconContainer from '../../../../../Modules/UserIcon';
import FormMessageItem from './FormMessageItem/FormMessageItem';

const Message = ({
  message,
  socket,
  room,
  loggedUser,
  showInputChange,
  callback,
  typeSocketAction,
}) => (
  <div className="chat-message-list-item">
    <div className="chat-message-list-item--header">
      <UserIconContainer
        user={{ user: message.sender }}
        hideNotificationBadge
      />
      <div className="chat-message-list-item--content">
        {showInputChange ? (
          <FormMessageItem
            socket={socket}
            room={room}
            typeSocketAction={typeSocketAction}
            loggedUser={loggedUser}
            value={message.message}
            message={message}
            callback={callback}
          />
        ) : (
          <Fragment>
            <div className="d-flex flex-align-items-baseline">
              <span className="fullname">{message.sender.fullName}</span>
              <span className="small">
                {message.createdAt &&
                  moment(message.createdAt).format('DD/MM/YYYY hh:mm')}
              </span>
            </div>
            {message.message}
          </Fragment>
        )}
      </div>
    </div>
  </div>
);

Message.propTypes = {
  socket: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  loggedUser: PropTypes.object.isRequired,
  showInputChange: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};

export default Message;
