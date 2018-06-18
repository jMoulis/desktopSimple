const Team = require('../models/Team');
const User = require('../models/User');
const Message = require('../models/Message');
const ApiResponse = require('../service/api/apiResponse');

module.exports = {
  index(req, res) {
    // Fetch messages by teams?!
    res.send('ok');
  },
  async create(req, res) {
    const messageProps = req.body;
    messageProps.author = { _id: res.locals.user._id };
    try {
      const project = await Message.create(messageProps);
      const apiResponse = new ApiResponse(res, {
        project,
        success: { status: true, message: 'Message created' },
      }, 200);
      return apiResponse.success();
    } catch (error) {
      const apiResponse = new ApiResponse(res, 400);
      return apiResponse.failure(error);
    }
  },
  edit(req, res) {
    res.send('edit');
  },
  delete(req, res) {
    res.send('delete');
  },
};
