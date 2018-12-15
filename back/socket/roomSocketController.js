const RoomController = require('../controllers/rooms_controller');
const Notifications = require('../models/Notifications');
const User = require('../models/User');
const Room = require('../models/Room');
const SocketResponse = require('../service/api/socketResponse');
const { ADD_ROOM_REQUEST_TO_USER } = require('./socketActionsConstant');

module.exports = (io, socket, usersConnected) => {
  socket.on(
    'NEW_ROOM',
    async (
      { values, sender, roomReceivedRequest, type, message },
      aknowledgment,
    ) => {
      try {
        const { newRoom, rooms, error } = await RoomController.create({
          values,
          sender,
          roomReceivedRequest,
        });

        if (error)
          return aknowledgment({ error: SocketResponse.failure(error) });

        roomReceivedRequest.forEach(async receiver => {
          await Notifications.create({
            type,
            body: message,
            sender,
            receiver,
            room: newRoom,
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
        });

        socket.join(`${newRoom._id}`);

        io.to(`${newRoom._id}`).emit('NEW_ROOM_SUCCESS', {
          room: newRoom._id,
          rooms,
        });

        aknowledgment({ success: true });
      } catch (error) {
        aknowledgment({ error: error.message });
      }
    },
  );
  socket.on(
    'REQUEST_ROOM_ACCEPT',
    async ({ roomId, senderId, notificationId }) => {
      try {
        await Notifications.updateOne(
          { _id: notificationId },
          { isRead: true },
        );

        await User.updateOne(
          { _id: senderId },
          {
            $pull: { roomReceivedRequest: roomId },
            $addToSet: {
              rooms: { _id: roomId, isDisplay: true },
            },
          },
        );

        /** Don't forget to remove the users from pendingrequest */
        await Room.updateOne(
          { _id: roomId },
          {
            $addToSet: { users: senderId },
          },
        );

        const notifications = await Notifications.find({
          receiver: senderId,
          isRead: false,
        });
        const query = {
          $or: [{ isPrivate: false }, { users: { $in: [senderId] } }],
        };
        const rooms = await Room.find(query, { messages: 0 }).populate({
          path: 'users',
          ref: 'user',
          select: 'fullName picture',
        });
        const privateRooms = rooms.filter(
          room => room.isPrivate && !room.isPrivateMessage,
        );
        const privateMessages = rooms.filter(room => room.isPrivateMessage);
        const teamRooms = rooms.filter(room => room.isTeamRoom);
        const globalRooms = rooms.filter(room => !room.isPrivate);
        // join room
        socket.join(`${roomId}`);

        io.to(`${socket.id}`).emit('REQUEST_ROOM_ACCEPT_SUCCESS', {
          notifications,
          rooms: {
            privateRooms,
            teamRooms,
            globalRooms,
            privateMessages,
          },
        });
      } catch (error) {
        console.error(error.message);
      }
    },
  );
  socket.on(
    'REQUEST_ROOM_DECLINE',
    async ({ roomId, senderId, notificationId }) => {
      try {
        await Notifications.updateOne(
          { _id: notificationId },
          { isRead: true },
        );

        await User.updateOne(
          { _id: senderId },
          {
            $pull: { roomReceivedRequest: roomId },
          },
        );
        /** Don't forget to remove the users from pendingrequest */
        // await Room.updateOne(
        //   { _id: roomId },
        //   {
        //     $addToSet: { users: senderId },
        //   },
        // );

        const notifications = await Notifications.find({
          receiver: senderId,
          isRead: false,
        });
        const query = {
          $or: [{ isPrivate: false }, { users: { $in: [senderId] } }],
        };
        const rooms = await Room.find(query, { messages: 0 }).populate({
          path: 'users',
          ref: 'user',
          select: 'fullName picture',
        });
        const privateRooms = rooms.filter(
          room => room.isPrivate && !room.isPrivateMessage,
        );
        const privateMessages = rooms.filter(room => room.isPrivateMessage);
        const teamRooms = rooms.filter(room => room.isTeamRoom);
        const globalRooms = rooms.filter(room => !room.isPrivate);

        io.to(`${socket.id}`).emit('REQUEST_ROOM_ACCEPT_SUCCESS', {
          notifications,
          rooms: {
            privateRooms,
            teamRooms,
            globalRooms,
            privateMessages,
          },
        });
      } catch (error) {
        console.error(error.message);
      }

      // callback('test');
    },
  );
  socket.on(
    ADD_ROOM_REQUEST_TO_USER,
    async ({ usersToAddRoomRequest, room, sender }) => {
      try {
        await RoomController.addRoomRequestToUser(
          {
            usersToAddRoomRequest,
            room,
            sender,
          },
          notifications => {
            usersToAddRoomRequest.forEach(async receiver => {
              const userToSendTo = usersConnected.getUserByUserId(receiver._id);

              if (userToSendTo) {
                io.to(`${userToSendTo.socketId}`).emit(
                  'NEW_NOTIFICATION_SUCCESS',
                  {
                    notifications,
                  },
                );
              }
            });
          },
        );
      } catch (error) {
        console.log('adduser to room', error.message);
      }
    },
  );
};
