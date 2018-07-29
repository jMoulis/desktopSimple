const ApiResponse = require('../service/api/apiResponse_v2');
const Task = require('../models/Task');
const { Dropbox } = require('dropbox');
require('isomorphic-fetch');

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
      if (req.body.documents) {
        const base64 = req.body.documents[0].value;
        const i = base64.indexOf('base64,');
        const buffer = Buffer.from(base64.slice(i + 7), 'base64');
        const { name } = req.body.documents[0];
        const dbx = new Dropbox({
          accessToken:
            'KBVp6yMlmPoAAAAAAAAGD_64SYobTlA9SDfVHyAj8Kag1fCAeRFCSzAU7i0lx2M3',
        });
        await dbx.filesUpload({ path: `/${name}`, contents: buffer });
      }
      const newTask = await Task.create(req.body);
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
};
