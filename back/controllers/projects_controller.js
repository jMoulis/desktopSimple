const Project = require('../models/Project');
const User = require('../models/User');
const ApiResponse = require('../service/api/apiResponse_v2');
const moment = require('moment');

module.exports = {
  async index(req, res) {
    const apiResponse = new ApiResponse(res);
    try {
      let params = { author: res.locals.user._id };
      if (res.locals.user.typeUser !== 'company') {
        params = {
          isOnline: true,
          roomLeft: true,
        };
      }
      if (req.query.search) {
        params = {
          ...params,
          $text: { $search: req.query.search, $caseSensitive: false },
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
          select: 'fullName picture company',
        })
        .populate({
          path: 'subscribers',
          model: 'user',
          select: 'fullName picture tags',
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
      return apiResponse.failure(422, error);
    }
  },

  async create(req, res) {
    const apiResponse = new ApiResponse(res);
    try {
      const projectProps = req.body;
      projectProps.author = { _id: res.locals.user._id };

      if (moment(projectProps.dueDate, 'DD/MM/YYYY').isValid()) {
        projectProps.dueDate = moment(
          projectProps.dueDate,
          'DD/MM/YYYY',
        ).format('YYYY-MM-DD');
      }
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
          path: 'author',
          model: 'user',
          select: 'fullName picture company',
        })
        .populate({
          path: 'subscribers',
          model: 'user',
          select: 'fullName picture tags',
        });

      return apiResponse.success(200, { project });
    } catch (error) {
      return apiResponse.failure(422, error);
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
          path: 'author',
          model: 'user',
          select: 'fullName picture company',
        })
        .populate({
          path: 'subscribers',
          model: 'user',
          select: 'fullName picture tags',
        });
      if (!project) {
        return apiResponse.failure(404, null, 'Project not found');
      }
      return apiResponse.success(200, { project });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },

  async edit(req, res) {
    const apiResponse = new ApiResponse(res);

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
      // Fetch the key name a set it to true
      // To send back only the field that changed
      const fieldNameChanged = Object.keys(projectProps)[0];
      const projection = {
        [fieldNameChanged]: 1,
      };

      const options = { runValidators: true };
      if ('subscribers' in projectProps) {
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
      projectProps = {
        ...projectProps,
        roomLeft: await module.exports.isProjectRoomLeft(projectId),
      };
      const updateProject = await Project.update(
        { _id: projectId },
        { ...projectProps, updatedAt: new Date() },
        options,
      );

      if (updateProject.n === 0) {
        return apiResponse.failure(400, null, 'Cannot update project');
      }

      const project = await Project.findById({ _id: projectId }, projection)
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
        });

      return apiResponse.success(
        200,
        {
          project: {
            field: Object.keys(projectProps)[0],
            value: project[Object.keys(projectProps)[0]],
            id: project._id,
          },
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
      if (deletedProject) {
        return apiResponse.success(201);
      }
    } catch (error) {
      next(error);
    }
  },
  async isProjectRoomLeft(projectId) {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw Error('No project found');
      }
      console.log(project.maxTeam);
      console.log(project.teams.length);
      if (project.maxTeam === project.teams.length + 1) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
