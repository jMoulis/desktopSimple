const MessageController = require('../controllers/messages_controller');

module.exports = (io, socket) => {
  socket.on('NEW_REPLY', async ({ message, room, sender, messageId }) => {
    try {
      const newMessage = await MessageController.createReply({
        message,
        sender,
        messageId,
      });
      io.to(`${room._id}`).emit('NEW_REPLY_SUCCESS', {
        reply: newMessage,
        room: room._id,
      });
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('UPDATE_REPLY', async ({ message, room, messageId }) => {
    try {
      const updateMessage = await MessageController.updateReply(messageId, {
        message,
      });
      io.to(`${room._id}`).emit('UPDATE_REPLY_SUCCESS', {
        reply: updateMessage,
      });
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('DELETE_REPLY', async ({ room, messageId }) => {
    try {
      const deleteMessage = await MessageController.deleteReply(messageId);
      io.to(`${room._id}`).emit('REPLY_DELETE_SUCCESS', {
        reply: deleteMessage,
      });
    } catch (error) {
      console.error(error.message);
    }
  });
};
