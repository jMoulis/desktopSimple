const RoomController = require('../controllers/rooms_controller');
const Room = require('../models/Room');
const UserModel = require('../models/User');
const UserClass = require('./users');

module.exports = io => {
  const usersConnected = new UserClass();

  io.on('connection', async socket => {
    console.log('User Connected');
    const newUser = await UserModel.findById(socket.handshake.query.userId);

    // if (connectedUsers.length === 0) {
    //   console.log('users empty');
    //   connectedUsers.push({
    //     fullName: newUser.fullName,
    //     picture: newUser.picture,
    //     _id: newUser._id,
    //     socket: socket.id,
    //   });
    // }
    // console.log(connectedUsers);
    // const exists = connectedUsers.find(user => user.socket === socket.id);
    // if (typeof exists !== 'undefined') {
    //   console.log('Exist', exists);
    // } else {
    //   console.log('Doesnot', exists);
    //   connectedUsers.push({
    //     fullName: newUser.fullName,
    //     picture: newUser.picture,
    //     _id: newUser._id,
    //     socket: socket.id,
    //   });
    // }
    io.of('/').clients((error, clients) => {
      console.log(clients);
    });
    // if (
    //   !connectedUsers.find(user => {
    //     console.log(newUser);
    //     user._id === newUser._id;
    //   })
    // ) {
    //   console.log('exists', newUser.fullName);
    // } else {
    //   console.log('Doesnot exists', newUser.fullName);
    //   connectedUsers.push({
    //     fullName: newUser.fullName,
    //     picture: newUser.picture,
    //     _id: newUser._id,
    //     socket: socket.id,
    //   });
    // }
    usersConnected.addUser(socket.id, newUser);
    io.emit('CONNECT_SUCCESS', {
      connectedUsers: usersConnected.getUsersList(),
    });
    const rooms = await Room.find({ isPrivate: false });
    rooms.forEach(room => socket.join(`${room._id}`));

    socket.on('disconnect', data => {
      usersConnected.removeUser(socket.id);
      io.emit('CONNECT_SUCCESS', {
        connectedUsers: usersConnected.getUsersList(),
      });
    });
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
