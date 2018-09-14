const Project = require('../models/Project');
const User = require('../models/User');
const ApiResponse = require('../service/api/apiResponse_v2');
const moment = require('moment');
const fs = require('fs');
const mime = require('mime');
const uuidv4 = require('uuid/v4');
const shell = require('shelljs');
const path = require('path');
const { isObjectEmpty } = require('../service/utils');

const ROOT_FOLDER = path.join(__dirname, '/../uploads');
module.exports = {
  async index(req, res, next) {
    const apiResponse = new ApiResponse(res, next);
    try {
      let params = { author: res.locals.user._id };
      if (res.locals.user.typeUser !== 'company') {
        params = {
          isOnline: true,
          roomLeft: true,
        };
      }
      if (req.query.filter) {
        params = {
          ...params,
          $text: { $search: req.query.filter, $caseSensitive: false },
        };
      }
      const projects = await Project.find({ ...params })
        .sort(
          req.query.sorting
            ? { createdAt: req.query.sorting }
            : { createdAt: 1 },
        )
        .populate({
          path: 'teams',
          select: 'name',
          populate: {
            path: 'users',
            model: 'user',
            select: 'spec',
          },
        })
        .populate({
          path: 'teams',
          select: 'name',
          populate: {
            path: 'users.user',
            model: 'user',
            select: 'fullName picture',
            options: { limit: 4 },
          },
        })
        .populate({
          path: 'author',
          model: 'user',
          select: 'fullName picture tags company',
        })
        .populate({
          path: 'subscribers',
          model: 'user',
          select: 'fullName picture tags',
        })
        .populate({
          path: 'files.author',
          model: 'user',
          select: 'fullName picture',
        });

      if (projects.length <= 0) {
        return apiResponse.failure(
          404,
          null,
          'No projects yet, you should come back later...',
        );
      }

      return apiResponse.success(200, { projects });
    } catch (error) {
      return apiResponse.failure(422, error, error.message);
    }
  },

  async create(req, res) {
    const apiResponse = new ApiResponse(res);
    const folder = uuidv4();
    try {
      let projectProps = req.body;
      projectProps = {
        ...projectProps,
        projectIdFolder: folder,
        author: res.locals.user._id,
      };

      if (moment(projectProps.dueDate, 'DD/MM/YYYY').isValid()) {
        projectProps.dueDate = moment(
          projectProps.dueDate,
          'DD/MM/YYYY',
        ).format('YYYY-MM-DD');
      }
      const filesProjectProps = await module.exports.buildingDocumentsObject(
        req,
        res.locals.user._id,
        folder,
        true,
      );

      console.log(projectProps);
      // Dealing with Tags
      if (Object.prototype.hasOwnProperty.call(projectProps, 'tags')) {
        projectProps = {
          ...projectProps,
          tags: projectProps.tags ? projectProps.tags.split(',') : [],
        };
      }

      projectProps = {
        ...projectProps,
        ...(filesProjectProps || null),
      };
      const newProject = await Project.create(projectProps);

      const project = await Project.findOne({ _id: newProject._id })
        .populate({
          path: 'teams',
          select: 'name',
          populate: {
            path: 'users',
            model: 'user',
            select: 'spec',
          },
        })
        .populate({
          path: 'teams',
          select: 'name',
          populate: {
            path: 'users.user',
            model: 'user',
            select: 'fullName picture',
            options: { limit: 4 },
          },
        })
        .populate({
          path: 'subscribers',
          model: 'user',
          select: 'fullName picture tags',
        })
        .populate({
          path: 'author',
          model: 'user',
          select: 'fullName picture tags company',
        })
        .populate({
          path: 'files.author',
          model: 'user',
          select: 'fullName picture',
        });

      return apiResponse.success(200, { project });
    } catch (error) {
      return apiResponse.failure(422, error, null);
    }
  },

  async show(req, res) {
    const apiResponse = new ApiResponse(res);
    try {
      const project = await Project.findOne({ _id: req.params.id })
        .populate({
          path: 'teams',
          select: 'name',
          populate: {
            path: 'users',
            model: 'user',
            select: 'spec',
          },
        })
        .populate({
          path: 'teams',
          select: 'name',
          populate: {
            path: 'users.user',
            model: 'user',
            select: 'fullName picture',
            options: { limit: 4 },
          },
        })
        .populate({
          path: 'subscribers',
          model: 'user',
          select: 'fullName picture tags',
        })
        .populate({
          path: 'author',
          model: 'user',
          select: 'fullName picture tags company',
        })
        .populate({
          path: 'files.author',
          model: 'user',
          select: 'fullName picture',
        });
      if (!project) {
        return apiResponse.failure(404, null, 'Project not found');
      }
      return apiResponse.success(200, { project });
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },

  async edit(req, res) {
    const apiResponse = new ApiResponse(res);
    let docRemoveUrl;
    try {
      const projectId = req.params.id;
      let projectProps = req.body;
      const userId = res.locals.user._id;

      if (moment(projectProps.dueDate, 'DD/MM/YYYY').isValid()) {
        projectProps.dueDate = moment(
          projectProps.dueDate,
          'DD/MM/YYYY',
        ).format('YYYY-MM-DD');
      }

      const options = { runValidators: true };

      if ('subscribers' in projectProps) {
        projectProps = {
          ...projectProps,
          subscribers: JSON.parse(projectProps.subscribers),
        };

        if (projectProps.subscribers.length > 0) {
          User.update(
            { _id: userId },
            { $push: { subscribes: projectId } },
          ).catch(error => apiResponse.failure(400, error));
        } else if (projectProps.subscribers.length === 0) {
          User.update(
            { _id: userId },
            { $pull: { subscribes: projectId } },
          ).catch(error => apiResponse.failure(400, error));
        }
      }

      if (Object.prototype.hasOwnProperty.call(req.body, 'files')) {
        const deleteDocumentQuery = await module.exports.deleteFile(
          req.body,
          'files',
        );
        projectProps = deleteDocumentQuery.query;
        docRemoveUrl = deleteDocumentQuery.docUrl;
      }

      const projectFolder = await Project.findOne({ _id: projectId });
      const filesProjectProps = await module.exports.buildingDocumentsObject(
        req,
        res.locals.user._id,
        projectFolder.projectIdFolder,
      );

      if (projectProps.tags) {
        projectProps = {
          ...projectProps,
          tags: projectProps.tags.split(','),
        };
      }
      projectProps = {
        ...projectProps,
        ...(filesProjectProps || null),
        roomLeft: await module.exports.isProjectRoomLeft(projectId),
      };

      // Dealing with Tags
      if (Object.prototype.hasOwnProperty.call(projectProps, 'tags')) {
        console.log(projectProps);
        projectProps = {
          ...projectProps,
          tags: projectProps.tags ? projectProps.tags.split(',') : [],
        };
      }

      const updateProject = await Project.update(
        { _id: projectId },
        { ...projectProps, updatedAt: new Date() },
        options,
      );

      if (updateProject.n === 0) {
        return apiResponse.failure(400, null, 'Cannot update project');
      }
      if (docRemoveUrl) {
        shell.rm(`${ROOT_FOLDER}${docRemoveUrl}`);
      }
      const project = await Project.findById({ _id: projectId })
        .populate({
          path: 'subscribers',
          model: 'user',
          select: 'fullName picture tags',
        })
        .populate({
          path: 'teams',
          select: 'name',
          populate: {
            path: 'users.user',
            model: 'user',
            select: 'fullName picture',
            options: { limit: 4 },
          },
        })
        .populate({
          path: 'author',
          model: 'user',
          select: 'fullName picture tags company',
        })
        .populate({
          path: 'files.author',
          model: 'user',
          select: 'fullName picture',
        });
      return apiResponse.success(
        200,
        {
          project,
        },
        Object.keys(projectProps)[0],
      );
    } catch (error) {
      return apiResponse.failure(400, null, error.message);
    }
  },
  async delete(req, res, next) {
    const projectId = req.params.id;
    const apiResponse = new ApiResponse(res);
    // Check later if I should delete teams after project deletion
    // Team.find({ project: projectId })
    //   .then((teams) => {
    //     User.updateMany({ teams: { $in: teams } }, { $pullAll: { teams } })
    //       .then()
    //       .catch(error => console.log(error));
    //   })
    //   .catch(error => console.log(error));
    // Team.remove({ project: projectId }).then();
    try {
      // await Team.update({ project: projectId }, { $unset: { project: '' } });
      const deletedProject = await Project.findByIdAndRemove({
        _id: projectId,
      });
      await shell.rm(
        '-R',
        `${ROOT_FOLDER}/users/${res.locals.user._id}/projects/${
          deletedProject.projectIdFolder
        }`,
      );
      if (deletedProject) {
        return apiResponse.success(201);
      }
    } catch (error) {
      next(error);
    }
  },
  async deleteFile(body, keyFiles, subDocument) {
    let key = `${keyFiles}`;

    if (subDocument) {
      key = `${subDocument}.${keyFiles}`;
    }
    const documentUser = await Project.findOne(
      {
        [`${key}._id`]: body[key],
      },
      { [key]: 1 },
    );
    if (!documentUser) return Error('No project found');

    let arrayToFindIn = documentUser[keyFiles];
    if (subDocument) {
      arrayToFindIn = documentUser[subDocument][keyFiles];
    }
    const document = arrayToFindIn.find(
      doc => doc._id.toString() === body[key],
    );
    if (!document) return Error('No file found');
    return {
      query: {
        $pull: {
          [key]: {
            _id: body[key],
          },
        },
      },
      docUrl: document.url,
    };
  },
  async isProjectRoomLeft(projectId) {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw Error('No project found');
      }
      if (project.maxTeam === project.teams.length + 1) {
        return false;
      }
      return true;
    } catch (error) {
      return error;
    }
  },
  async buildingDocumentsObject(req, userId, folder, isNewDocument) {
    if (req.files && !isObjectEmpty(req.files)) {
      let files = [];
      files = await req.files.map(file => {
        const fileName = `${file.fieldname}-${uuidv4()}.${mime.extension(
          file.mimetype,
        )}`;

        const fullPath = `${ROOT_FOLDER}/users/${userId}/projects/${folder}`;

        if (fs.existsSync(fullPath)) {
          fs.writeFileSync(`${fullPath}/${fileName}`, file.buffer);
        } else {
          shell.mkdir('-p', fullPath);
          fs.writeFileSync(`${fullPath}/${fileName}`, file.buffer);
        }

        return {
          originalName: file.originalname,
          name: fileName,
          extension: mime.extension(file.mimetype),
          mimetype: file.mimetype,
          folder: `/users/${userId}/projects/${folder}/${fileName}`,
          author: userId,
          createdAt: new Date(),
          url: `/users/${userId}/projects/${folder}/${fileName}`,
          type: 'projects',
        };
      });
      if (isNewDocument) {
        return {
          files: [...files],
        };
      }
      return {
        $push: {
          files: [...files],
        },
      };
    }
    return false;
  },
};
