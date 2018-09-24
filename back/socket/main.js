const RoomController = require('../controllers/rooms_controller');
const Room = require('../models/Room');

module.exports = io => {
  io.on('connection', async socket => {
    console.log('User Connected');
    const rooms = await Room.find({ isPrivate: false });
    rooms.forEach(room => socket.join(`${room._id}`));

    socket.on('JOIN_PRIVATE_REQUEST', (id, { room, receiver }, callback) => {
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

    socket.on('ROOM_MESSAGE', async ({ message, room, sender }) => {
      try {
        const newMessage = await RoomController.createMessage(
          { message, sender },
          room,
        );
        io.to(`${room._id}`).emit('NEW_ROOM_MESSAGE_SUCCESS', {
          message: newMessage,
          room: room._id,
        });
      } catch (error) {
        console.error(error.message);
      }
    });

    socket.on('NEW_MESSAGE', async ({ message, room, receiver, sender }) => {
      try {
        const newMessage = await RoomController.createMessage(
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
