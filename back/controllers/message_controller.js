const Message = require('../models/Message');
const Notifications = require('../models/Notifications');

const ApiResponse = require('../service/api/apiResponse_v2');

module.exports = {
  async index(req, res, next) {
    const apiResponse = new ApiResponse(res);
    try {
      const { sender, receiver } = req.query;
      const messages = await Message.find({
        $or: [
          {
            room: `${sender}.${receiver}`,
          },
          { room: `${receiver}.${sender}` },
        ],
      })
        .populate({
          path: 'sender',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'receiver',
          model: 'user',
          select: 'fullName picture',
        });
      return apiResponse.success(200, {
        messages,
      });
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },
  async create(req, res, next) {
    const apiResponse = new ApiResponse(res);
    try {
      const newMessage = await Message.create(req.body);
      const message = await Message.findOne({ _id: newMessage._id })
        .populate({
          path: 'sender',
          ref: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'receiver',
          ref: 'user',
          select: 'fullName picture',
        });
      // module.exports.socket.on('PRIVATE_MESSAGE', room => {
      //   module.exports.io.to(room).emit('NEW_MESSAGE', message);
      // });
      return apiResponse.success(201);
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },
  edit(req, res) {
    res.send('edit');
  },
  delete(req, res) {
    res.send('delete');
  },
};
