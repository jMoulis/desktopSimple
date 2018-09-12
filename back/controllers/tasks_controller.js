const fs = require('fs');
const mime = require('mime');
const path = require('path');
const uuidv4 = require('uuid/v4');
const shell = require('shelljs');

const ApiResponse = require('../service/api/apiResponse_v2');
const Task = require('../models/Task');

const ROOT_FOLDER = path.join(__dirname, '/../uploads');

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
      const tasks = await Task.find(query, { taskIdFolder: 0 })
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
      const folder = uuidv4();
      let queryValues = {
        ...req.body,
        activities: [
          {
            type: 'new task',
            author: res.locals.user._id,
            createdAt: new Date(),
          },
        ],
        taskIdFolder: folder,
      };
      if (req.files) {
        let files = [];
        files = await req.files.map(file => {
          const fullPath = `${ROOT_FOLDER}/teams/${
            req.body.team
          }/tasks/${folder}`;

          const fileName = `${file.fieldname}-${uuidv4()}.${mime.extension(
            file.mimetype,
          )}`;

          if (fs.existsSync(fullPath)) {
            fs.writeFileSync(`${fullPath}/${fileName}`, file.buffer);
          } else {
            shell.mkdir('-p', fullPath);
            fs.writeFileSync(`${fullPath}/${fileName}`, file.buffer);
          }

          const url = `/teams/${req.body.team}/tasks/${folder}/${fileName}`;

          return {
            originalName: file.originalname,
            name: fileName,
            extension: mime.extension(file.mimetype),
            mimetype: file.mimetype,
            path: `/teams/${req.body.team}/tasks/${folder}`,
            folder,
            author: res.locals.user._id,
            createdAt: new Date(),
            url,
            type: 'task',
          };
        });
        queryValues = {
          ...queryValues,
          files: [...files],
        };
      }
      if (queryValues.tags) {
        queryValues = {
          ...queryValues,
          tags: queryValues.tags.split(','),
        };
      }
      const newTask = await Task.create(queryValues);

      const task = await Task.findOne({ _id: newTask._id }, { taskIdFolder: 0 })
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
      const task = await Task.findOne(
        { _id: req.params.id },
        { taskIdFolder: 0 },
      )
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
      let updateQuery = {
        author: {
          _id: res.locals.user._id,
          fullName: res.locals.user.fullName,
          picture: res.locals.user.picture,
          company: res.locals.user.company && {
            companyName: res.locals.user.company.companyName,
            description: res.locals.user.company.description,
            tags: res.locals.user.company.tags,
            picture: res.locals.user.company.picture,
          },
        },
      };
      let docRemoveUrl;
      let updateType = Object.keys(req.body).map(key => key)[0];
      // Deal with document remove action

      if (Object.prototype.hasOwnProperty.call(req.body, 'files')) {
        const documentTask = await Task.findOne(
          { 'files._id': req.body.files },
          { files: 1 },
        );
        const document = documentTask.files.find(
          doc => doc._id.toString() === req.body.files,
        );
        if (document) {
          docRemoveUrl = document.url;
        }
        updateType = 'remove a file';
        updateQuery = {
          ...updateQuery,
          $pull: {
            files: {
              _id: req.body.files,
            },
          },
        };
      } else {
        updateQuery = {
          ...req.body,
        };
      }

      const task = await Task.findOne({ _id: req.params.id });
      if (!task) {
        return apiResponse.failure(404, null, 'Task not found');
      }
      // Dealing if files upload
      const folder = task.taskIdFolder;

      if (req.files && req.files.length > 0) {
        let files = [];
        files = await req.files.map(file => {
          const fullPath = `${ROOT_FOLDER}/teams/${
            req.body.team
          }/tasks/${folder}`;

          const fileName = `${file.fieldname}-${uuidv4()}.${mime.extension(
            file.mimetype,
          )}`;

          if (fs.existsSync(fullPath)) {
            fs.writeFileSync(`${fullPath}/${fileName}`, file.buffer);
          } else {
            shell.mkdir('-p', fullPath);
            fs.writeFileSync(`${fullPath}/${fileName}`, file.buffer);
          }

          const url = `/teams/${req.body.team}/tasks/${folder}/${fileName}`;

          return {
            originalName: file.originalname,
            name: fileName,
            extension: mime.extension(file.mimetype),
            mimetype: file.mimetype,
            path: `/teams/${req.body.team}/tasks/${folder}`,
            folder,
            author: res.locals.user._id,
            createdAt: new Date(),
            url,
            type: 'task',
          };
        });
        updateType = 'add a new file';
        updateQuery = {
          ...updateQuery,
          $push: {
            files: [...files],
          },
        };
      }

      if (updateQuery.tags) {
        updateQuery = {
          ...updateQuery,
          tags: updateQuery.tags.split(','),
        };
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
      // Remove file from filesystem after updating
      if (docRemoveUrl) {
        shell.rm(`${ROOT_FOLDER}${docRemoveUrl}`);
      }

      // Prepare the task object response
      const updatedTask = await Task.findOne(
        { _id: req.params.id },
        { taskIdFolder: 0 },
      )
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

      return apiResponse.success(
        201,
        {
          task: updatedTask,
        },
        Object.keys(req.body).map(key => key)[0],
      );
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
      await shell.rm(
        '-R',
        `${ROOT_FOLDER}/teams/${task.team}/tasks/${task.taskIdFolder}`,
      );
      const tasks = await Task.find({ team: task.team }, { taskIdFolder: 0 });
      return apiResponse.success(201, {
        tasks,
      });
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
};
