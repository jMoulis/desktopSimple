const Team = require('../models/Team');
const User = require('../models/User');
const Task = require('../models/Task');
const Project = require('../models/Project');
const ApiResponse = require('../service/api/apiResponse_v2');
const Room = require('../models/Room');

const decodeBase64Image = dataString => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }
  response.type = matches[1];
  response.data = Buffer.from(matches[2], 'base64');

  return response;
};

module.exports = {
  async index(req, res, next) {
    const apiResponse = new ApiResponse(res);
    const userId = res.locals.user._id;
    try {
      const teams = await Team.find({ 'users.user': userId })
        .populate({
          path: 'manager',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'project',
          model: 'project',
          populate: {
            path: 'author',
            model: 'user',
            select: 'fullName picture company',
          },
        })
        .populate({
          path: 'users.user',
          model: 'user',
          select: 'fullName picture',
        });
      if (teams.length === 0) {
        return apiResponse.failure(404, null, {
          teams: {
            status: 404,
            source: { pointer: '/data/attributes/teams' },
            title: 'Not Found',
            detail: 'No teams found',
          },
        });
      }
      return apiResponse.success(200, { teams });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },
  async create(req, res) {
    const teamProps = req.body;
    const manager = res.locals.user && res.locals.user._id;
    const apiResponse = new ApiResponse(res);
    try {
      const roomName = teamProps.name.replace(' ', '_').toUpperCase();
      const teamCreated = await Team.create({
        ...teamProps,
        manager,
        room: roomName,
      });
      const team = await Team.findOne({ _id: teamCreated.id })
        .populate({
          path: 'manager',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'project.author',
          model: 'user',
          select: 'fullName picture company',
        })
        .populate({
          path: 'project',
          model: 'project',
          populate: {
            path: 'author',
            model: 'user',
            select: 'fullName picture company',
          },
        })
        .populate({
          path: 'users.user',
          model: 'user',
          select: 'fullName picture',
        });
      const ids = team.users.map(({ user }) => user);

      const room = await Room.create({
        users: ids,
        isPrivate: true,
        isTeamRoom: true,
        name: roomName,
      });

      await User.updateMany(
        { _id: { $in: ids } },
        {
          $addToSet: {
            teams: team,
            rooms: room._id,
          },
        },
      );

      await Project.update(
        { _id: team.project },
        {
          $push: { teams: team._id },
        },
      );
      return apiResponse.success(201, { team }, true);
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },
  async show(req, res) {
    const { id } = req.params;
    const apiResponse = new ApiResponse(res);
    try {
      const team = await Team.findById(id)
        .populate({
          path: 'manager',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'project',
          model: 'project',
          populate: {
            path: 'author',
            model: 'user',
            select: 'fullName picture company',
          },
        })
        .populate({
          path: 'users.user',
          model: 'user',
          select: 'fullName picture',
        });
      if (!team) {
        return apiResponse.failure(404, null, 'Team not found');
      }
      return apiResponse.success(200, { team });
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
    }
  },

  async edit(req, res) {
    const teamId = req.params.id;
    const teamProps = req.body;
    const apiResponse = new ApiResponse(res);
    const imageTypeRegularExpression = /\/(.*?)$/;

    if (req.body.picture) {
      const imageBuffer = decodeBase64Image(req.body.picture);
      const typeUploadedFile = imageBuffer.type.match(
        imageTypeRegularExpression,
      )[1];
      const validFormat = ['jpeg', 'png'];
      if (!validFormat.includes(typeUploadedFile)) {
        return apiResponse.failure(
          422,
          null,
          'Wrong format. Valid format jpg/jpeg/png',
        );
      }
    }

    const options = { runValidators: true };

    try {
      const updateTeam = await Team.update({ _id: teamId }, teamProps, options);
      if (updateTeam.n === 0) {
        return apiResponse.failure(422, null, 'Unable to Update team');
      }
      const team = await Team.findById({ _id: teamId }, { password: 0 })
        .populate({
          path: 'manager',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'project',
          model: 'project',
          populate: {
            path: 'author',
            model: 'user',
            select: 'fullName picture company',
          },
        })
        .populate({
          path: 'users.user',
          model: 'user',
          select: 'fullName picture',
        });

      if (teamProps.users) {
        const ids = teamProps.users.map(({ user }) => user._id);
        await Room.update(
          { name: team.room },
          {
            $addToSet: {
              users: ids,
            },
          },
        );
      }
      if (team.project) {
        const updateProject = await Project.update(
          { _id: team.project },
          { $addToSet: { teams: team._id } },
        );
        if (!updateProject) {
          return apiResponse.failure(422, null, 'Unable to Update project');
        }
      } else {
        await Project.findOneAndUpdate(
          {
            teams: {
              $in: [team._id],
            },
          },
          {
            $pull: {
              teams: team._id,
            },
            roomLeft: true,
          },
        );
      }
      return apiResponse.success(200, { team });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },

  async delete(req, res, next) {
    const teamId = req.params.id;
    const apiResponse = new ApiResponse(res);
    try {
      const teamToRemove = await Team.findOne({ _id: teamId });
      const ids = teamToRemove.users.map(({ user }) => user);
      await Team.findByIdAndRemove({ _id: teamId });
      // Delete tasks related
      await Task.remove({ team: teamId });

      const room = await Room.findOneAndRemove({ name: teamToRemove.room });
      await User.updateMany(
        { _id: { $in: ids } },
        {
          $pull: {
            teams: teamToRemove._id,
            rooms: room._id,
          },
        },
      );
      await Project.update(
        { teams: { $in: teamToRemove._id } },
        {
          $pull: {
            teams: { $in: [teamToRemove._id] },
          },
        },
      );

      const teams = await Team.find({ 'users.user': res.locals.user })
        .populate({
          path: 'manager',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'project',
          model: 'project',
          populate: {
            path: 'author',
            model: 'user',
            select: 'fullName picture company',
          },
        })
        .populate({
          path: 'users.user',
          model: 'user',
          select: 'fullName picture',
        });

      return apiResponse.success(201, { teams });
    } catch (error) {
      next(error);
    }
  },
};
