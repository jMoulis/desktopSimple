const Team = require('../models/Team');
const User = require('../models/User');
const Project = require('../models/Project');
const ApiResponse = require('../service/api/apiResponse');

const decodeBase64Image = (dataString) => {
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
        })
        .populate({
          path: 'users.user',
          model: 'user',
          select: 'fullName picture',
        });
      if (teams.length === 0) {
        const apiResponse = new ApiResponse(res, {
          teams: {
            status: 404,
            source: { pointer: '/data/attributes/teams' },
            title: 'Not Found',
            detail: 'No teams found',
          },
        }, 404);
        return apiResponse.failure();
      }
      const apiResponse = new ApiResponse(res, {
        teams,
        success: 'Teams',
      }, 200);
      return apiResponse.success();
    } catch (error) {
      next(error);
    }
  },
  async create(req, res) {
    const teamProps = req.body;
    const manager = res.locals.user._id;
    try {
      const teamCreated = await Team.create({ ...teamProps, manager });
      const team = await Team.findOne({ _id: teamCreated.id })
        .populate({
          path: 'manager',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'project',
          model: 'project',
        })
        .populate({
          path: 'users.user',
          model: 'user',
          select: 'fullName picture',
        });
      // Add the new teams to user object
      const ids = team.users.map(({ user }) => user);
      User.updateMany({ _id: { $in: ids } }, {
        $addToSet: {
          teams: team,
          rooms: team._id,
        },
      }).catch(error => console.log(error.message));
      await Project.update(
        { _id: team.project },
        {
          $push: { teams: team._id },
        },
      )
        .catch(error => console.log('Project Update', error.message));
      const apiResponse = new ApiResponse(res, {
        team,
        success: { status: true, message: 'New Team Created' },
      }, 200);
      return apiResponse.success();
    } catch (error) {
      const apiResponse = new ApiResponse(res, 400);
      return apiResponse.failure(error);
    }
  },
  async show(req, res, next) {
    const { id } = req.params;
    await Team.findById(id)
      .populate({
        path: 'manager',
        model: 'user',
        select: 'fullName picture',
      })
      .populate({
        path: 'project',
        model: 'project',
      })
      .populate({
        path: 'users.user',
        model: 'user',
        select: 'fullName picture',
      })
      .then((team) => {
        const apiResponse = new ApiResponse(res, {
          team,
          success: 'Team',
        }, 200);
        return apiResponse.success();
      })
      .catch(next);
  },

  async edit(req, res, next) {
    const teamId = req.params.id;
    const teamProps = req.body;
    const imageTypeRegularExpression = /\/(.*?)$/;
    if (req.body.picture) {
      const imageBuffer = decodeBase64Image(req.body.picture);
      const typeUploadedFile = imageBuffer.type.match(imageTypeRegularExpression)[1];
      const validFormat = ['jpeg', 'png'];
      if (!validFormat.includes(typeUploadedFile)) {
        const apiResponse = new ApiResponse(res, {
          picture: {
            status: 400,
            source: { pointer: '/data/attributes/picture' },
            title: 'Bad Request',
            detail: 'Wrong format. Valid format jpg/jpeg/png',
          },
        }, 400);
        return apiResponse.failure();
      }
    }
    const options = { runValidators: true };
    try {
      await Team.update({ _id: teamId }, teamProps, options, (error) => {
        if (error) {
          const apiResponse = new ApiResponse(res, 400);
          return apiResponse.failure(error);
        }
      }).catch(error => console.log('Error update type', error.message));

      const team = await Team.findById({ _id: teamId }, { password: 0 })
        .populate({
          path: 'manager',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'project',
          model: 'project',
        })
        .populate({
          path: 'users.user',
          model: 'user',
          select: 'fullName picture',
        });
      if (team.project) {
        await Project.update(
          { _id: team.project },
          { $addToSet: { teams: team._id } },
        )
          .catch(error => console.log('Project Update', error.message));
      } else {
        await Project.findOneAndUpdate({
          teams: {
            $in: [team._id],
          },
        }, {
            $pull: {
              teams: team._id,
            },
          });
      }
      const apiResponse = new ApiResponse(res, { team, success: 'Modify' }, 200);
      return apiResponse.success();
    } catch (error) {
      console.log(error);
    }
  },

  delete(req, res, next) {
    const teamId = req.params.id;
    Team.findByIdAndRemove({ _id: teamId })
      .then((team) => {
        const ids = team.users.map(({ user }) => user);
        User.updateMany({ _id: { $in: ids } }, {
          $pull: {
            teams: team._id,
            rooms: team._id,
          },
        }).catch(error => console.log(error.message));
        const apiResponse = new ApiResponse(res, { success: 'Delete' }, 204);
        return apiResponse.success();
      })
      .catch(next);
  },
};
