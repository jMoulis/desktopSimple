const fs = require('fs');
const path = require('path');
const mime = require('mime');

const ApiResponse = require('../service/api/apiResponse_v2');
const Task = require('../models/Task');

module.exports = {
  index: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const tasks = await Task.find({ team: req.params.id });
      if (!tasks || tasks.length === 0) {
        return apiResponse.failure(404, null, 'No task found');
      }
      return apiResponse.success(200, { tasks });
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },
  create: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const documents = req.files;
      let docs = [];
      if (documents) {
        docs = await documents.map(document => document.path);
      }
      const newTask = await Task.create({ ...req.body, documents: docs });
      return apiResponse.success(201, { task: newTask });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },
  read: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const task = await Task.findOne({ _id: req.params.id });
      if (!task) {
        return apiResponse.failure(404, null, 'No task found');
      }
      return apiResponse.success(200, { task });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },
  update: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      return apiResponse.success(204, { message: 'update' });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },
  delete: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      return apiResponse.success(204, { message: 'delete' });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },
  file: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const fileId = req.params.id;
      return apiResponse.success(200);
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },
};
