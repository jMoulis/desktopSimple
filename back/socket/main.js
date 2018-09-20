const mongoose = require('mongoose');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

module.exports = io => {
  io.on('connection', socket => {
    console.log('User Connected');
    // socket.on('USER_CONNECT', user => {
    //   user.socketId = socket.id;
    //   connectedUsers = addUser(connectedUsers, user);
    //   socket.user = user;
    //   io.emit('USER_CONNECTED', connectedUsers);
    // });

    socket.on('JOIN_REQUEST', (id, { room, receiver }) => {
      io.to(`${id}`).emit('START_PRIVATE_CHAT', {
        message: `start private chat with ${receiver.fullName}`,
      });
      socket.join(room);
    });

    socket.on('NEW_MESSAGE', async ({ message, room, receiver, sender }) => {
      try {
        const newMessage = await Message.create({
          message,
          receiver,
          sender,
        });
        await Conversation.findOneAndUpdate(
          {
            _id: room,
          },
          {
            $push: {
              messages: newMessage,
            },
          },
        );
        io.to(`${room}`).emit('NEW_MESSAGE_SUCCESS', {
          message: newMessage,
          room,
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};
