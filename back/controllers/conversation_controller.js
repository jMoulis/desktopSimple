const ApiResponse = require('../service/api/apiResponse_v2');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

module.exports = {
  index: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const conversations = await Conversation.find({
        $or: [{ receiver: req.query.sender }, { sender: req.query.receiver }],
      })
        .populate('messages')
        .populate({
          path: 'users',
          ref: 'user',
          select: 'fullName picture',
        });

      return apiResponse.success(200, { conversations });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },
  create: async (message, room) => {
    // const apiResponse = new ApiResponse(res);
    try {
      const newMessage = await Message.create(message);
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
      return newMessage;
    } catch (error) {
      return console.log(error.message);
    }
  },

  read: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const conversation = await Conversation.findOne({
        users: { $all: [req.query.sender, req.query.receiver] },
      })
        .populate('messages')
        .populate({
          path: 'users',
          ref: 'user',
          select: 'fullName picture',
        });

      if (!conversation) {
        const newConversation = await Conversation.create({
          users: [req.query.sender, req.query.receiver],
        });

        return apiResponse.success(201, { conversation: newConversation });
      }

      return apiResponse.success(200, { conversation });
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
