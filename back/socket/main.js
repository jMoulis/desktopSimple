const RoomController = require('../controllers/rooms_controller');
const Room = require('../models/Room');
const UserModel = require('../models/User');
const Notifications = require('../models/Notifications');
const UserClass = require('./users');

module.exports = io => {
  const usersConnected = new UserClass();

  io.on('connection', async socket => {
    console.log('User Connected');
    const newUser = await UserModel.findById(socket.handshake.query.userId);
    usersConnected.addUser(socket.id, newUser);

    io.emit('CONNECT_SUCCESS', {
      connectedUsers: usersConnected.getUsersList(),
    });
    const rooms = await Room.find({
      $or: [{ isPrivate: false }, { isTeamRoom: true }],
    });

    rooms.forEach(room => socket.join(`${room._id}`));

    socket.on('disconnect', () => {
      usersConnected.removeUser(socket.id);
      io.emit('CONNECT_SUCCESS', {
        connectedUsers: usersConnected.getUsersList(),
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

    socket.on('NEW_NOTIFICATION', async ({ message, sender, receiver }) => {
      if (receiver) {
        await Notifications.create({
          type: 'message',
          body: message,
          sender,
          receiver,
        });
        const notifications = await Notifications.find({
          receiver,
          type: 'message',
          isRead: false,
        });
        const userToSendTo = usersConnected.getUserByUserId(receiver);
        io.to(`${userToSendTo.socketId}`).emit('NEW_NOTIFICATION_SUCCESS', {
          notifications,
        });
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

    // socket.on('NEW_TASK', async ({ assign, sender, task }) => {
    //   try {
    //     const userToSendTo = usersConnected.getUser(assign._id.toString());
    //     io.to(`${userToSendTo.socketId}`).emit('NEW_TASK_SUCCESS', {
    //       message: 'New Task',
    //     });
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // });
  });
};
