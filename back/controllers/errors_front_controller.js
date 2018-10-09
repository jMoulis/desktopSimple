const agent = require('useragent');
const Log = require('../models/Log');
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
    const useragent = agent.parse(req.headers['user-agent']).toJSON();
    try {
      await Log.create({
        log: {
          message: req.body.error.message,
          stackTrace: req.body.error.stack,
          agent: {
            browser: {
              name: useragent.family,
              version: useragent.major,
            },
            os: useragent.os.family,
            device: useragent.device.family,
          },
        },
      });
      return apiResponse.success(201, {
        message: 'The problem has been sent to the administrator',
      });
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
