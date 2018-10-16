const Message = require('../models/Message');
const Room = require('../models/Room');

const ApiResponse = require('../service/api/apiResponse_v2');

module.exports = {
  async fetchRoomMessages(req, res) {
    const apiResponse = new ApiResponse(res);
    try {
      const messages = await Message.find({ room: req.params.roomId })
        .populate({
          path: 'sender',
          ref: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'receiver',
          ref: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'replies.sender',
          ref: 'user',
          select: 'fullName picture',
        });

      return apiResponse.success(200, { messages });
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },
  async create(values) {
    try {
      const newMessage = await Message.create(values);
      await Room.update(
        {
          _id: newMessage.room,
        },
        {
          $push: {
            messages: newMessage,
          },
        },
      );
      const message = await Message.findOne({ _id: newMessage._id }).populate({
        path: 'sender',
        ref: 'user',
        select: 'fullName picture',
      });
      return message;
    } catch (error) {
      return error.message;
    }
  },
  async createReply({ message, sender, messageId }) {
    try {
      await Message.update(
        { _id: messageId },
        {
          $addToSet: { replies: { message, sender } },
        },
      );
      const updateMessage = await Message.findOne({ _id: messageId })
        .populate({
          path: 'sender',
          ref: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'replies.sender',
          ref: 'user',
          select: 'fullName picture',
        });
      return updateMessage;
    } catch (error) {
      return error.message;
    }
  },
  async update(messageId, data) {
    try {
      await Message.update({ _id: messageId }, data);
      const message = await Message.findOne({ _id: messageId })
        .populate({
          path: 'sender',
          ref: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'replies.sender',
          ref: 'user',
          select: 'fullName picture',
        });
      return message;
    } catch (error) {
      return console.log(error.message);
    }
  },
  async updateReply(messageId, data) {
    try {
      await Message.update(
        { 'replies._id': messageId },
        {
          $set: {
            'replies.$.message': data.message,
          },
        },
      );
      const message = await Message.findOne({ 'replies._id': messageId })
        .populate({
          path: 'sender',
          ref: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'replies.sender',
          ref: 'user',
          select: 'fullName picture',
        });
      return message;
    } catch (error) {
      return console.log(error.message);
    }
  },
  async delete(messageId) {
    try {
      const message = await Message.findByIdAndRemove({ _id: messageId });
      return message;
    } catch (error) {
      return console.log(error.message);
    }
  },
  async deleteReply(messageId) {
    try {
      const messageToUpdate = await Message.findOneAndUpdate(
        { 'replies._id': messageId },
        {
          $pull: {
            replies: {
              _id: messageId,
            },
          },
        },
      );
      const message = await Message.findOne({ _id: messageToUpdate._id })
        .populate({
          path: 'sender',
          ref: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'replies.sender',
          ref: 'user',
          select: 'fullName picture',
        });
      return message;
    } catch (error) {
      return console.log(error.message);
    }
  },
};
