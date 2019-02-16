const Room = require('../models/Room');
const UserModel = require('../models/User');
const UserClass = require('./users');
const messageSocketController = require('./messageSocketController');
const replySocketController = require('./replySocketController');
const notificationSocketController = require('./notificationSocketController');
const roomSocketController = require('./roomSocketController');

module.exports = io => {
  const usersConnected = new UserClass();

  io.on('connection', async socket => {
    console.log('User Connected');
    const newUser = await UserModel.findById(socket.handshake.query.userId);
    usersConnected.addUser(socket.id, newUser);

    io.emit('CONNECT_SUCCESS', {
      connectedUsers: usersConnected.getUsersList(),
    });
    console.log('Connect_Success');
    const rooms = await Room.find({
      $or: [{ isPrivate: false }, { isTeamRoom: true }],
    });

    rooms.forEach(room => socket.join(`${room._id}`));

    socket.on('disconnect', () => {
      usersConnected.removeUser(socket.id);
      usersConnected.removeTypingUser(socket.id);
      io.emit('CONNECT_SUCCESS', {
        connectedUsers: usersConnected.getUsersList(),
      });
    });

    socket.on('JOIN_PRIVATE_REQUEST', props => {
      try {
        socket.join(props.room);
      } catch (error) {
        console.error('join request', error.message);
      }
    });

    messageSocketController(io, socket, usersConnected);
    replySocketController(io, socket);
    notificationSocketController(io, socket, usersConnected);
    roomSocketController(io, socket, usersConnected);

    // socket.on('NEW_TASK', async ({ assign, sender, task }) => {
    //   try {
    //     const userToSendTo = usersConnected.getUser(assign._id.toString());
    //     io.to(`${userToSendTo.socketId}`).emit('NEW_TASK_SUCCESS', {
    //       message: 'New Task',
    //     });
    //   } catch (error) {
    //     console.error(error.message);
    //   }
    // });
  });
};
