const ApiResponse = require('../service/api/apiResponse_v2');
const Room = require('../models/Room');
const User = require('../models/User');
const Notifications = require('../models/Notifications');

module.exports = {
  index: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    let { query } = req;
    try {
      query = {
        $or: [{ isPrivate: false }, { users: { $in: [res.locals.user._id] } }],
      };
      const rooms = await Room.find(query, { messages: 0 }).populate({
        path: 'users',
        ref: 'user',
        select: 'fullName picture',
      });

      const privateMessages = rooms.filter(room => room.isPrivateMessage);
      const privateRooms = rooms.filter(
        room => room.isPrivate && !room.isPrivateMessage,
      );
      const teamRooms = rooms.filter(room => room.isTeamRoom);
      const globalRooms = rooms.filter(room => !room.isPrivate);

      if (req.query.updatestatus) {
        const userId = req.params.id;
        const roomId = req.params.room;
        await User.update(
          { _id: userId, 'rooms._id': roomId },
          {
            $set: {
              'rooms.$.isDisplay': req.query.updatestatus,
            },
          },
        );
      }

      const loggedUserRooms = await User.findOne(
        { _id: res.locals.user._id },
        { rooms: 1, _id: 0 },
      );

      return apiResponse.success(200, {
        rooms: {
          privateMessages: privateMessages.filter(room => {
            if (room) {
              return loggedUserRooms.rooms.find(
                userRoom =>
                  userRoom._id &&
                  userRoom._id.toString() === room._id.toString() &&
                  userRoom.isDisplay,
              );
            }
          }),
          teamRooms,
          globalRooms,
          privateRooms: privateRooms.filter(room => {
            if (room && !room.isTeamRoom) {
              return loggedUserRooms.rooms.find(
                userRoom =>
                  userRoom._id &&
                  userRoom._id.toString() === room._id.toString() &&
                  userRoom.isDisplay,
              );
            }
          }),
        },
      });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },
  create: async ({ values, sender, roomReceivedRequest }) => {
    try {
      const newRoom = await Room.create(values);
      const usersRequestedIds = roomReceivedRequest.map(
        roomRequestUser => roomRequestUser._id,
      );

      await User.update(
        { _id: { $in: usersRequestedIds } },
        { $addToSet: { roomReceivedRequest: newRoom._id } },
      );
      await User.update(
        { _id: sender },
        { $addToSet: { rooms: { _id: newRoom._id, isDisplay: true } } },
      );
      const query = {
        $or: [{ isPrivate: false }, { users: { $in: [sender] } }],
      };

      const rooms = await Room.find(query, { messages: 0 }).populate({
        path: 'users',
        ref: 'user',
        select: 'fullName picture',
      });

      const privateMessages = rooms.filter(room => room.isPrivateMessage);
      const teamRooms = rooms.filter(room => room.isTeamRoom);
      const globalRooms = rooms.filter(room => !room.isPrivate);
      const privateRooms = rooms.filter(
        room => room.isPrivate && !room.isPrivateMessage,
      );

      return {
        newRoom,
        rooms: {
          privateRooms,
          teamRooms,
          globalRooms,
          privateMessages,
        },
      };
    } catch (error) {
      return { error };
    }
  },
  async searchPrivateRoom(req, res) {
    const apiResponse = new ApiResponse(res);
    try {
      const regex = new RegExp(req.query.search, 'i');
      const users = await User.find({ fullName: regex }, { _id: 1 });
      if (!users)
        return apiResponse.failure(404, null, { message: 'User not found' });

      const ids = array => array.map(item => item._id);

      const rooms = await Room.find(
        {
          users: { $in: [...ids(users)] },
          isPrivateMessage: true,
        },
        { users: 1 },
      );

      let filteredUsers = {
        users: [],
      };

      rooms.forEach(async room => {
        let { users } = room;
        users = users.filter(
          user => user.toString() !== res.locals.user._id.toString(),
        );
        filteredUsers = {
          ...filteredUsers,
          users: [...filteredUsers.users, ...users],
        };
      });

      const responseUsers = await User.find(
        { _id: { $in: [...filteredUsers.users] } },
        { fullName: 1, picture: 1 },
      );

      return apiResponse.success(200, {
        users: responseUsers,
      });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },

  fetchRoomMessages: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const room = await Room.findOne({ _id: req.params.id })
        .populate({
          path: 'messages',
          ref: 'message',
          populate: {
            path: 'sender',
            ref: 'user',
            select: 'fullName picture',
          },
        })
        .populate({
          path: 'users',
          ref: 'user',
          select: 'fullName picture',
        });

      return apiResponse.success(200, { room });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },

  read: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const room = await Room.findOne(
        {
          users: [req.query.sender, req.query.receiver],
          // users: {
          //   $all: [req.query.sender, req.query.receiver],
          // },
          isPrivateMessage: true,
        },
        { messages: 0 },
      )
        .populate('messages')
        .populate({
          path: 'users',
          ref: 'user',
          select: 'fullName picture',
        });
      if (!room) {
        const newRoom = await Room.create({
          users: [req.query.sender, req.query.receiver],
          isPrivateMessage: true,
          name: `${req.query.sender}&${req.query.receiver}`,
        });

        const response = await Room.findById(newRoom._id)
          .populate('messages')
          .populate({
            path: 'users',
            ref: 'user',
            select: 'fullName picture',
          });

        await User.updateMany(
          { _id: { $in: [req.query.sender, req.query.receiver] } },
          {
            $addToSet: {
              rooms: { _id: newRoom._id, isDisplay: true },
            },
          },
        );
        return apiResponse.success(201, { room: response });
      }
      return apiResponse.success(201, { room });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },

  addRoomRequestToUser: async (
    { usersToAddRoomRequest, room, sender },
    callback,
  ) => {
    try {
      const usersRequestedIds = usersToAddRoomRequest.map(
        roomRequestUser => roomRequestUser._id,
      );
      await User.updateMany(
        { _id: { $in: usersRequestedIds } },
        { $addToSet: { roomReceivedRequest: room._id } },
      );
      const users = await User.find(
        { _id: { $in: usersRequestedIds } },
        { fullName: 1, picture: 1 },
      );

      await Room.updateOne(
        { _id: room._id },
        { $addToSet: { pendingRequest: users } },
      );

      // 2- add notification
      usersToAddRoomRequest.forEach(async receiver => {
        await Notifications.create({
          type: 'room_request',
          body: 'New room request',
          sender,
          receiver,
          room,
        });

        const notifications = await Notifications.find({
          receiver,
          type: 'room_request',
          isRead: false,
        });
        callback(notifications);
      });
    } catch (error) {
      return { error };
    }
  },
  update: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      return apiResponse.success(204, { message: 'update' });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },

  delete: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      return apiResponse.success(204, { message: 'delete' });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },
};
