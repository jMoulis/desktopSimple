import io from 'socket.io-client';

export default () => {
  const socket = io.connect('http://localhost:3050');

  const registerHandler = (onMessagereceived) => {
    socket.on('message', onMessagereceived);
  };
  const join = (chatroom, cb) => {
    socket.emit('join', chatroom, cb);
  };
  return {
    registerHandler,
    join,
  };
};
