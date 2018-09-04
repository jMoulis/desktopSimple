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
    let query = {
      team: req.params.id,
    };
    if (req.query.myTask) {
      query = {
        ...query,
        assign: res.locals.user._id,
      };
    }
    try {
      const tasks = await Task.find(query)
        .populate({
          path: 'author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'comments.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'activities.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'documents.author',
          model: 'user',
          select: 'fullName picture',
        })
        .sort({ createdAt: -1 });
      if (!tasks || tasks.length === 0) {
        return apiResponse.failure(404, null, 'Oups! No tasks found');
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
            originalName: document.originalname,
            name: fileName,
            extension: mime.extension(document.mimetype),
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
      const newTask = await Task.create({
        ...req.body,
        author: res.locals.user._id,
        documents: docs,
        activities: [
          {
            type: 'new task',
            author: res.locals.user._id,
            createdAt: new Date(),
          },
        ],
      });

      const task = await Task.findOne({ _id: newTask._id })
        .populate({
          path: 'author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'documents.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'activities.author',
          model: 'user',
          select: 'fullName picture',
        });

      return apiResponse.success(201, { task }, true);
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },

  read: async (req, res) => {
    const apiResponse = new ApiResponse(res);
    try {
      const task = await Task.findOne({ _id: req.params.id })
        .populate({
          path: 'author',
          model: 'user',
          select: 'fullName picture company',
        })
        .populate({
          path: 'comments.author',
          model: 'user',
          select: 'fullName picture company',
        })
        .populate({
          path: 'documents.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'activities.author',
          model: 'user',
          select: 'fullName picture',
        });
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
      const fieldname = Object.keys(req.body).map(key => key)[0];
      const updateTask = await Task.update(
        { _id: req.params.id },
        {
          ...req.body,
          $push: {
            activities: {
              type: `modification to ${fieldname}`,
              author: res.locals.user._id,
              createdAt: new Date(),
            },
          },
        },
      );
      if (updateTask.n === 0) {
        return apiResponse.success(422, null, 'Unable to update');
      }

      const updatedTask = await Task.findOne({ _id: req.params.id })
        .populate({
          path: 'author',
          model: 'user',
          select: 'fullName picture company',
        })
        .populate({
          path: 'comments.author',
          model: 'user',
          select: 'fullName picture company',
        })
        .populate({
          path: 'documents.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'activities.author',
          model: 'user',
          select: 'fullName picture',
        });

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
