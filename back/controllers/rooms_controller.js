const ApiResponse = require('../service/api/apiResponse_v2');
const Room = require('../models/Room');
const User = require('../models/User');
const Message = require('../models/Message');

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

      const privateRooms = rooms.filter(room => room.isPrivateMessage);
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

      const privateRoomsFiltered = privateRooms.filter(room => {
        if (room) {
          return loggedUserRooms.rooms.find(
            userRoom =>
              userRoom._id &&
              userRoom._id.toString() === room._id.toString() &&
              userRoom.isDisplay,
          );
        }
      });

      return apiResponse.success(200, {
        rooms: {
          privateRooms: privateRoomsFiltered,
          teamRooms,
          globalRooms,
        },
      });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },
  createMessage: async (message, room) => {
    try {
      const newMessage = await Message.create(message);
      await Room.findOneAndUpdate(
        {
          _id: room,
        },
        {
          $push: {
            messages: newMessage,
          },
        },
      );
      const responseMessage = await Message.findOne({
        _id: newMessage._id,
      }).populate({
        path: 'sender',
        ref: 'user',
        select: 'fullName picture',
      });
      return responseMessage;
    } catch (error) {
      return console.error(error.message);
    }
  },
  async searchPrivateRoom(req, res) {
    // find in room users with the name

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
          users: {
            $all: [req.query.sender, req.query.receiver],
          },
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
