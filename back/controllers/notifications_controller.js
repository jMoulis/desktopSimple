const Notifications = require('../models/Notifications');

const ApiResponse = require('../service/api/apiResponse_v2');

module.exports = {
  async index(req, res, next) {
    const apiResponse = new ApiResponse(res);
    try {
      const notifications = await Notifications.find({
        receiver: res.locals.user._id,
        isRead: false,
      });
      return apiResponse.success(200, {
        notifications,
      });
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },
  async update(req, res) {
    const apiResponse = new ApiResponse(res);
    try {
      await Notifications.updateMany(
        {
          receiver: res.locals.user._id,
          sender: req.body.sender,
          type: req.body.type,
        },
        {
          $set: {
            isRead: true,
          },
        },
      );
      const notifications = await Notifications.find({
        receiver: res.locals.user._id,
        isRead: false,
      });
      return apiResponse.success(200, {
        notifications,
      });
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },
  delete(req, res) {
    res.send('delete');
  },
};
