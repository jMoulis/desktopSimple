const RoomController = require('../controllers/rooms_controller');
const Room = require('../models/Room');
const UserModel = require('../models/User');
const UserClass = require('./users');

module.exports = io => {
  const usersConnected = new UserClass();

  io.on('connection', async socket => {
    console.log('User Connected');
    const newUser = await UserModel.findById(socket.handshake.query.userId);
    const alreadyConnected = usersConnected.getUsersList();
    usersConnected.addUser(socket.id, newUser);
    const uniqueIds = [...new Set(alreadyConnected.map(user => user._id))];
    const users = await UserModel.find(
      { _id: { $in: uniqueIds } },
      { picture: 1, fullName: 1 },
    );

    io.emit('CONNECT_SUCCESS', {
      connectedUsers: users,
    });
    const rooms = await Room.find({
      $or: [{ isPrivate: false }, { isTeamRoom: true }],
    });

    rooms.forEach(room => socket.join(`${room._id}`));

    socket.on('disconnect', data => {
      usersConnected.removeUser(socket.id);
      io.emit('CONNECT_SUCCESS', {
        connectedUsers: users,
      });
    });

    socket.on('JOIN_PRIVATE_REQUEST', (id, props, callback) => {
      try {
        io.to(`${id}`).emit('START_PRIVATE_CHAT', {
          message: `start private chat with ${props.receiver.fullName}`,
        });
        socket.join(props.room);
        if (callback) {
          callback(props.receiver._id);
        }
      } catch (error) {
        console.error('join request', error.message);
      }
    });

    socket.on('ROOM_MESSAGE', async ({ message, room, sender }) => {
      try {
        console.log(message, room);
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
