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
          select: 'fullName',
        })
        .populate({
          path: 'comments.author',
          model: 'user',
          select: 'fullName',
        })
        .populate({
          path: 'activities.author',
          model: 'user',
          select: 'fullName',
        })
        .populate({
          path: 'documents.author',
          model: 'user',
          select: 'fullName',
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
            url: `${req.headers.folder}|${fileName}|${document.mimetype}|${
              req.headers.type
            }`,
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
          select: 'fullName',
        })
        .populate({
          path: 'comments.author',
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
      const { files } = req;
      let docs = [];
      let updateQuery = {};
      let docRemoveUrl = '';
      let updateType = Object.keys(req.body).map(key => key)[0];
      // Deal with document remove action

      if (Object.prototype.hasOwnProperty.call(req.body, 'documents')) {
        const documentTask = await Task.findOne(
          { 'documents._id': req.body.documents },
          { documents: 1 },
        );
        const document = documentTask.documents.find(
          doc => doc._id.toString() === req.body.documents,
        );
        if (document) {
          docRemoveUrl = document.url;
        }
        updateQuery = {
          ...updateQuery,
          $pull: {
            documents: {
              _id: req.body.documents,
            },
          },
        };
        updateType = 'remove a document';
      } else {
        updateQuery = {
          ...req.body,
        };
      }

      // Dealing if files upload
      if (files && files.length > 0) {
        docs = await files.map(document => {
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
            url: `${req.headers.folder}|${fileName}|${document.mimetype}|${
              req.headers.type
            }`,
            type: req.headers.type,
          };
        });
        updateType = 'add a new document';
        updateQuery = {
          ...updateQuery,
          $push: {
            documents: [...docs],
          },
        };
      }

      const task = await Task.findOne({ _id: req.params.id });
      if (!task) {
        return apiResponse.failure(404, null, 'Task not found');
      }

      updateQuery = {
        ...updateQuery,
        $push: {
          ...updateQuery.$push,
          activities: {
            type: updateType,
            author: res.locals.user._id,
            createdAt: new Date(),
          },
        },
      };

      const updateTask = await Task.update({ _id: req.params.id }, updateQuery);

      if (updateTask.n === 0) {
        return apiResponse.success(422, null, 'Unable to update');
      }
      // Remove file from filesystem
      module.exports.deleteFile(docRemoveUrl);

      // Prepare the task object response
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

      return apiResponse.success(201, {
        task: updatedTask,
      });
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
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

  readFile: req => {
    const paramsFromQuery = req.split('|');
    const folder = paramsFromQuery[0];
    const fileName = paramsFromQuery[1];
    const mimeType = paramsFromQuery[2];
    const type = paramsFromQuery[3];

    const TYPE_FOLDER = path.join(ROOT_FOLDER, `${type}`);
    const FOLDER = path.join(TYPE_FOLDER, `/${folder}`);
    const FILE = path.join(FOLDER, `/${fileName}`);

    try {
      if (
        fs.existsSync(TYPE_FOLDER) &&
        fs.existsSync(FOLDER) &&
        fs.existsSync(FILE)
      ) {
        const fileBase64 = fs.readFileSync(FILE, { encoding: 'base64' });
        return {
          value: `data:${mimeType};base64,${fileBase64}`,
        };
      }
    } catch (error) {
      return error.message;
    }
  },

  deleteFile: req => {
    const paramsFromQuery = req.split('|');
    const folder = paramsFromQuery[0];
    const fileName = paramsFromQuery[1];
    const type = paramsFromQuery[3];
    const TYPE_FOLDER = path.join(ROOT_FOLDER, `${type}`);
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
      }
    } catch (error) {
      return error.message;
    }
  },

  deleteFolder: folder => {
    if (fs.existsSync(folder) && fs.readdirSync(folder).length === 0) {
      fs.rmdirSync(folder);
    }
  },
};
