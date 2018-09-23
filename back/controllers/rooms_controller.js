const ApiResponse = require('../service/api/apiResponse_v2');
const Room = require('../models/Room');
const Message = require('../models/Message');

module.exports = {
  index: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const rooms = await Room.find({
        users: { $in: [res.locals.user._id] },
      })
        .populate('messages')
        .populate({
          path: 'users',
          ref: 'user',
          select: 'fullName picture',
        });

      return apiResponse.success(200, { rooms });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },

  create: async (message, room) => {
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
      return newMessage;
    } catch (error) {
      return console.log(error.message);
    }
  },

  read: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const room = await Room.findOne({
        users: { $all: [req.query.sender, req.query.receiver] },
      })
        .populate('messages')
        .populate({
          path: 'users',
          ref: 'user',
          select: 'fullName picture',
        });
      if (!room) {
        const newRoom = await Room.create({
          users: [req.query.sender, req.query.receiver],
        });

        return apiResponse.success(201, { room: newRoom });
      }

      return apiResponse.success(200, { room });
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
