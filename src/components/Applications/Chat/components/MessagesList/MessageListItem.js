import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UserIconContainer from '../../../../../Modules/UserIcon';

const MessageListItem = ({ message }) => {
  return (
    <div className="chat-message-list-item">
      <div className="chat-message-list-item--header">
        <UserIconContainer
          user={{ user: message.sender }}
          hideNotificationBadge
        />
        <div>
          <div className="d-flex flex-align-items-baseline">
            <span className="fullname">{message.sender.fullName}</span>
            <span className="small">
              {message.createdAt &&
                moment(message.createdAt).format('DD/MM/YYYY hh:mm')}
            </span>
          </div>
          <div className="chat-message-list-item--content">
            {message.message}
          </div>
        </div>
      </div>
    </div>
  );
};

MessageListItem.propTypes = {
  message: PropTypes.object.isRequired,
};

export default MessageListItem;
