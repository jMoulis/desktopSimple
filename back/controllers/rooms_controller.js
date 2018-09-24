const ApiResponse = require('../service/api/apiResponse_v2');
const Room = require('../models/Room');
const Message = require('../models/Message');

module.exports = {
  index: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    let { query } = req;
    try {
      if ('global') {
        query = {
          isPrivate: false,
        };
      }
      /*{
        users: { $in: [res.locals.user._id] },
      }*/
      const rooms = await Room.find(query)
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

      return apiResponse.success(200, { rooms });
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
      return console.log(error.message);
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
          isPrivate: true,
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
