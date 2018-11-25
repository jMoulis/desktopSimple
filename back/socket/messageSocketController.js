const MessageController = require('../controllers/messages_controller');
const UserController = require('../controllers/users_controller');

module.exports = (io, socket, usersConnected) => {
  const handleError = (stack, error) => {
    io.to(`${socket.id}`).emit('FAILURE', {
      message: error,
    });
  };
  socket.on('NEW_MESSAGE', async ({ message, room, sender }) => {
    try {
      const newMessage = await MessageController.create({
        message,
        sender,
        room,
      });
      const userRoomStatusUpdated = await UserController.setRoomDisplayStatus(
        true,
        room,
      );

      io.to(`${room._id}`).emit('NEW_MESSAGE_SUCCESS', {
        message: newMessage,
        user: userRoomStatusUpdated,
      });
    } catch (error) {
      handleError(error, 'Error while sending message');
    }
  });
  socket.on('UPDATE_MESSAGE', async ({ message, room, messageId }) => {
    try {
      const updateMessage = await MessageController.update(messageId, {
        message,
      });
      io.to(`${room._id}`).emit('UPDATE_MESSAGE_SUCCESS', {
        message: updateMessage,
      });
    } catch (error) {
      console.error(error.message);
    }
  });
  socket.on('DELETE_MESSAGE', async ({ room, messageId }) => {
    try {
      const deleteMessage = await MessageController.delete(messageId);
      io.to(`${room._id}`).emit('DELETE_MESSAGE_SUCCESS', {
        message: deleteMessage,
      });
    } catch (error) {
      console.error(error.message);
    }
  });
  socket.on('IS_TYPING_MESSAGE', async ({ room, sender }) => {
    try {
      usersConnected.addTypingUser(socket.id, sender);
      socket.to(`${room._id}`).emit('IS_TYPING_MESSAGE_SUCCESS', {
        sender,
        typingUsers: usersConnected.getTypingUsers(),
        room,
      });
    } catch (error) {
      console.error(error.message);
    }
  });
  socket.on('STOP_TYPING_MESSAGE', async ({ room }) => {
    try {
      io.to(`${room._id}`).emit('STOP_TYPING_MESSAGE_SUCCESS', {
        typingUsers: usersConnected.removeTypingUser(socket.id),
      });
    } catch (error) {
      console.error(error.message);
    }
  });
};
