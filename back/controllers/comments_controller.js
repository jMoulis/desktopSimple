const mongoose = require('mongoose');
const Task = require('../models/Task');

const ApiResponse = require('../service/api/apiResponse_v2');

module.exports = {
  index: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      return apiResponse.success(200, { message: 'index' });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },
  create: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      return apiResponse.success(201, { message: 'create' });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },
  read: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      return apiResponse.success(200, { message: 'read' });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },
  update: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const commentId = req.query.comment;
      await Task.updateOne(
        {
          _id: req.params.id,
          'comments._id': mongoose.Types.ObjectId(commentId),
        },
        {
          $set: {
            'comments.$.message': req.body.message,
            'comments.$.updateAt': new Date(),
          },
          $push: {
            activities: {
              $each: [
                {
                  type: 'edit a comment',
                  author: res.locals.user._id,
                  createdAt: new Date(),
                },
              ],
              $sort: { createdAt: -1 },
            },
          },
        },
      );

      const updatedTask = await Task.findOne(
        { _id: req.params.id },
        { taskIdFolder: 0 },
      )
        .populate({
          path: 'comments.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'files.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'activities.author',
          model: 'user',
          select: 'fullName picture',
        });

      return apiResponse.success(201, {
        task: updatedTask,
      });
    } catch (error) {
      return apiResponse.failure(422, error, { message: error.message });
    }
  },
  delete: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const commentId = req.query.comment;
      await Task.update(
        { _id: req.params.id },
        {
          $pull: {
            comments: { _id: mongoose.Types.ObjectId(commentId) },
          },
          $push: {
            activities: {
              $each: [
                {
                  type: 'remove a comment',
                  author: res.locals.user._id,
                  createdAt: new Date(),
                },
              ],
              $sort: { createdAt: -1 },
            },
          },
        },
      );

      const updatedTask = await Task.findOne(
        { _id: req.params.id },
        { taskIdFolder: 0 },
      )
        .populate({
          path: 'comments.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'files.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'activities.author',
          model: 'user',
          select: 'fullName picture',
        });

      return apiResponse.success(201, {
        task: updatedTask,
      });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },
};
