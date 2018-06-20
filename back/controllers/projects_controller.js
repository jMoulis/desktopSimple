const Project = require('../models/Project');
const User = require('../models/User');
const Team = require('../models/Team');
const ApiResponse = require('../service/api/apiResponse');
const moment = require('moment');

module.exports = {
  async index(req, res) {
    let params = { author: res.locals.user._id };
    if (res.locals.user.typeUser !== 'company') {
      params = {};
    }
    try {
      const projects = await Project.find(params)
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
        const apiResponse = new ApiResponse(res, {
          projects: [],
          error: 'No projects yet, you should come back later...',
        }, 404);
        return apiResponse.failure();
      }
      const apiResponse = new ApiResponse(res, {
        projects,
        success: 'Projects',
      }, 200);
      return apiResponse.success();
    } catch (error) {
      const apiResponse = new ApiResponse(res, 400);
      return apiResponse.failure(error);
    }
  },

  async create(req, res) {
    const projectProps = req.body;
    projectProps.author = { _id: res.locals.user._id };
    if (moment(projectProps.dueDate, 'DD/MM/YYYY').isValid()) {
      projectProps.dueDate = moment(projectProps.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }
    try {
      const project = await Project.create(projectProps);
      const apiResponse = new ApiResponse(res, {
        project,
        success: { status: true, message: 'New Project Created' },
      }, 200);
      return apiResponse.success();
    } catch (error) {
      const apiResponse = new ApiResponse(res, 400);
      return apiResponse.failure(error);
    }
  },

  async show(req, res) {
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
    try {
      if (!project) {
        const apiResponse = new ApiResponse(res, {
          status: 404,
          source: { pointer: '/data/attributes/picture' },
          title: 'Bad Request',
          detail: 'Project Not Found',
        }, 404);
        return apiResponse.failure();
      }
      const apiResponse = new ApiResponse(res, {
        project,
        success: {
          status: true,
          message: 'Project found',
        },
      }, 200);
      return apiResponse.success();
    } catch (error) {
      const apiResponse = new ApiResponse(res, 400);
      return apiResponse.failure(error);
    }
  },

  edit(req, res, next) {
    const projectId = req.params.id;
    const projectProps = req.body;
    const userId = res.locals.user._id;
    if (moment(projectProps.dueDate, 'DD/MM/YYYY').isValid()) {
      projectProps.dueDate = moment(projectProps.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }
    // Fetch the key name a set it to true
    // To send back only the field that changed
    const projection = {
      [Object.keys(projectProps)[0]]: 1,
    };
    const options = { runValidators: true };
    Project.update(
      { _id: projectId },
      { ...projectProps, updatedAt: new Date() },
      options,
      (error) => {
        if (error) {
          const apiResponse = new ApiResponse(res, 400);
          return apiResponse.failure(error);
        }
      },
    )
      .then(() => {
        return Project.findById({ _id: projectId }, projection)
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
      })
      .then((project) => {
        if ('subscribers' in projectProps) {
          if (projectProps.subscribers.length > 0) {
            User.update({ _id: userId }, { $push: { subscribes: project._id } })
              .catch(error => console.log(error.message));
          } else if (projectProps.subscribers.length === 0) {
            User.update({ _id: userId }, { $pull: { subscribes: project._id } })
              .catch(error => console.log(error.message));
          }
        }
        const apiResponse = new ApiResponse(res, {
          project: {
            field: Object.keys(projectProps)[0],
            value: project[Object.keys(projectProps)[0]],
            id: project._id,
          },
          success: {
            status: true,
            message: 'Updated',
          },
        }, 200);
        return apiResponse.success();
      })
      .catch(next);
  },

  delete(req, res, next) {
    const projectId = req.params.id;
    // Check later if I should delete teams after project deletion
    // Team.find({ project: projectId })
    //   .then((teams) => {
    //     User.updateMany({ teams: { $in: teams } }, { $pullAll: { teams } })
    //       .then()
    //       .catch(error => console.log(error));
    //   })
    //   .catch(error => console.log(error));
    // Team.remove({ project: projectId }).then();
    Project.findByIdAndRemove({ _id: projectId })
      .then(() => {
        res.status(204).send({ message: 'deleted' });
      })
      .catch(next);
    Team.findByAndUpdate({ project: projectId }, { $unset: { project: '' } })
      .then(response => console.log(response))
      .catch(error => console.log(error.message));
  },
};
