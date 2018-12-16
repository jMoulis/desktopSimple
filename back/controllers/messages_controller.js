const Message = require('../models/Message');
const Room = require('../models/Room');

const ApiResponse = require('../service/api/apiResponse_v2');

module.exports = {
  async fetchRoomMessages(req, res) {
    const apiResponse = new ApiResponse(res);
    try {
      const totalMessage = await Message.find({
        room: req.params.roomId,
      }).count();
      let limit = 10;
      if (req.query.limit) {
        limit += Number(req.query.limit);
      }
      let skip = 0;
      if (totalMessage > limit) {
        skip = totalMessage - limit;
      }
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
        })
        .skip(skip)
        .limit(limit);

      return apiResponse.success(200, { messages, totalMessage, limit });
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },
  async create({ message, sender, room }) {
    try {
      const createdMessage = await Message.create({ message, sender, room });
      await Room.update(
        {
          _id: createdMessage.room,
        },
        {
          $push: {
            messages: createdMessage,
          },
        },
      );
      const newMessage = await Message.findOne({
        _id: createdMessage._id,
      }).populate({
        path: 'sender',
        ref: 'user',
        select: 'fullName picture',
      });

      const totalMessage = await Message.find({
        room,
      }).count();

      return { newMessage, totalMessage };
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
