const Notifications = require('../models/Notifications');

module.exports = (io, socket, usersConnected) => {
  socket.on(
    'NEW_NOTIFICATION',
    async ({ message, sender, receiver, type, room }) => {
      if (receiver) {
        await Notifications.create({
          type,
          body: message,
          sender,
          receiver,
          room,
        });
        const notifications = await Notifications.find({
          receiver,
          type,
          isRead: false,
        });
        const userToSendTo = usersConnected.getUserByUserId(receiver._id);
        if (userToSendTo) {
          io.to(`${userToSendTo.socketId}`).emit('NEW_NOTIFICATION_SUCCESS', {
            notifications,
          });
        }
      }
    },
  );
};
