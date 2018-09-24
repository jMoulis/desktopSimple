import React from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../Modules/UserIcon';
import Wrapper from '../Wrapper';
import MessagesList from './MessagesList';
import ChatBoxForm from './ChatBoxForm';

const ChatBox = ({ room, loggedUser, socket, receiver, callback }) => (
  <Wrapper reduceOnMount={false}>
    {room.users.map(user => {
      if (loggedUser._id !== user._id) {
        return <UserIconContainer key={user._id} user={{ user }} name />;
      }
      return true;
    })}
    <MessagesList room={room} />
    <ChatBoxForm
      room={room._id}
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
};

export default ChatBox;
