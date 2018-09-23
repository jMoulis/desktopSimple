const RoomController = require('../controllers/rooms_controller');

module.exports = io => {
  io.on('connection', socket => {
    console.log('User Connected');
    // socket.on('USER_CONNECT', user => {
    //   user.socketId = socket.id;
    //   connectedUsers = addUser(connectedUsers, user);
    //   socket.user = user;
    //   io.emit('USER_CONNECTED', connectedUsers);
    // });

    socket.on('JOIN_REQUEST', (id, { room, receiver }, callback) => {
      try {
        io.to(`${id}`).emit('START_PRIVATE_CHAT', {
          message: `start private chat with ${receiver.fullName}`,
        });
        socket.join(room);
        if (callback) {
          callback(receiver._id);
        }
      } catch (error) {
        console.error('join request', error.message);
      }
    });

    socket.on('NEW_MESSAGE', async ({ message, room, receiver, sender }) => {
      try {
        const newMessage = await RoomController.create(
          { message, receiver, sender },
          room,
        );
        io.to(`${room}`).emit('NEW_MESSAGE_SUCCESS', {
          message: newMessage,
          room,
        });
      } catch (error) {
        console.log(error.message);
      }
    });
  });
};
