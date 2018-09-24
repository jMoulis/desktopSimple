import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';

const MessageListItem = ({ message }) => {
  return (
    <div>
      <UserIconContainer user={{ user: message.sender }} name />
      <p>{message.message}</p>
    </div>
  );
};

MessageListItem.propTypes = {
  message: PropTypes.object.isRequired,
};

export default MessageListItem;
