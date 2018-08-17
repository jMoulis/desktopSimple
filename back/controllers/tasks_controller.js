const fs = require('fs');
const mime = require('mime');
const path = require('path');
const uuidv4 = require('uuid/v4');

const ApiResponse = require('../service/api/apiResponse_v2');
const Task = require('../models/Task');

const ROOT_FOLDER = path.join(__dirname, '/../uploads/');

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
        docs = await documents.map(document => {
          const root = `${ROOT_FOLDER}${req.headers.type}`;
          const destination = `${ROOT_FOLDER}${req.headers.type}/${
            req.headers.folder
          }`;
          const fileName = `${document.fieldname}-${uuidv4()}.${mime.extension(
            document.mimetype,
          )}`;

          if (fs.existsSync(root)) {
            if (fs.existsSync(destination)) {
              fs.writeFileSync(`${destination}/${fileName}`, document.buffer);
            } else {
              fs.mkdirSync(destination);
              fs.writeFileSync(`${destination}/${fileName}`, document.buffer);
            }
          } else {
            fs.mkdirSync(root);
            fs.mkdirSync(destination);
            fs.writeFileSync(`${destination}/${fileName}`, document.buffer);
          }

          return {
            name: fileName,
            mimetype: document.mimetype,
            folder: req.headers.folder,
            author: res.locals.user._id,
            createdAt: new Date(),
            url: `/api/files?file=${req.headers.folder}|${fileName}|${
              document.mimetype
            }|${req.headers.type}`,
            type: req.headers.type,
          };
        });
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
        return apiResponse.failure(404, null, 'Task not found');
      }
      return apiResponse.success(200, { task });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },

  update: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const task = await Task.findOne({ _id: req.params.id });
      if (!task) {
        return apiResponse.failure(404, null, 'Task not found');
      }
      const updateTask = await Task.update({ _id: req.params.id }, req.body);
      if (updateTask.n === 0) {
        return apiResponse.success(422, null, 'Unable to update');
      }

      const updatedTask = await Task.findOne({ _id: req.params.id });

      return apiResponse.success(201, { task: updatedTask });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },

  delete: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const task = await Task.findByIdAndRemove({ _id: req.params.id });
      if (!task) {
        return apiResponse.failure(404, null, 'Task not found');
      }
      return apiResponse.success(204);
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },
};
