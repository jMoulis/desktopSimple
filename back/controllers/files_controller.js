const fs = require('fs');
const path = require('path');

const ApiResponse = require('../service/api/apiResponse_v2');

module.exports = {
  index: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    const paramsFromQuery = req.query.file.split('|');
    const folder = paramsFromQuery[0];
    const fileName = paramsFromQuery[1];
    const mimeType = paramsFromQuery[2];
    const type = paramsFromQuery[3];
    const ROOT_FOLDER = path.join(__dirname, `/../uploads`);
    const TYPE_FOLDER = path.join(ROOT_FOLDER, `/${type}`);
    const FOLDER = path.join(TYPE_FOLDER, `/${folder}`);
    const FILE = path.join(FOLDER, `/${fileName}`);
    try {
      if (
        fs.existsSync(TYPE_FOLDER) &&
        fs.existsSync(FOLDER) &&
        fs.existsSync(FILE)
      ) {
        const fileBase64 = fs.readFileSync(FILE, { encoding: 'base64' });
        return apiResponse.success(200, {
          file: `data:${mimeType};base64,${fileBase64}`,
        });
      }
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },

  delete: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    const paramsFromQuery = req.query.file.split('|');
    const folder = paramsFromQuery[0];
    const fileName = paramsFromQuery[1];
    const type = paramsFromQuery[3];
    const ROOT_FOLDER = path.join(__dirname, `/../uploads`);
    const TYPE_FOLDER = path.join(ROOT_FOLDER, `/${type}`);
    const FOLDER = path.join(TYPE_FOLDER, `/${folder}`);
    const FILE = path.join(FOLDER, `/${fileName}`);
    try {
      if (
        fs.existsSync(TYPE_FOLDER) &&
        fs.existsSync(FOLDER) &&
        fs.existsSync(FILE)
      ) {
        fs.unlinkSync(FILE);
        module.exports.deleteFolder(FOLDER);
        return apiResponse.success(204);
      }
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },

  deleteFolder: folder => {
    if (fs.existsSync(folder) && fs.readdirSync(folder).length === 0) {
      fs.rmdirSync(folder);
    }
  },
};
