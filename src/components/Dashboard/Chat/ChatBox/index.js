import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../Modules/UserIcon';
import Wrapper from '../Wrapper';
import MessagesList from './MessagesList';
import Form from './Form';

const ChatBox = ({
  room,
  loggedUser,
  close,
  reduce,
  socket,
  receiver,
  callback,
}) => (
  <Wrapper reduceOnMount={false}>
    {room.users.map(user => {
      if (loggedUser._id !== user._id) {
        return <UserIconContainer user={{ user }} name />;
      }
    })}
    <MessagesList room={room} />
    <Form
      room={room}
      loggedUser={loggedUser}
      socket={socket}
      receiver={receiver}
      callback={callback}
    />
  </Wrapper>
);

ChatBox.propTypes = {
  socket: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  receiver: PropTypes.object.isRequired,
  loggedUser: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
  close: PropTypes.func,
  reduce: PropTypes.func,
};

ChatBox.defaultProps = {
  close: null,
  reduce: null,
};
export default ChatBox;
