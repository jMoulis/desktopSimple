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
