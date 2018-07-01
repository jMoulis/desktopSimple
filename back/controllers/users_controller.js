const User = require('../models/User');
const ApiResponse = require('../service/api/apiResponse');

module.exports = {
  async index(req, res) {
    try {
      const query = {
        tags: { $in: [req.query.filter] },
        available: true,
        typeUser: 'student',
      };
      if (req.query.count && req.query.filter) {
        const usersCount = await User.find(query).count();
        const apiResponse = new ApiResponse(res, {
          count: {
            key: req.query.filter,
            count: usersCount,
          },
          success: 'Count',
        }, 200);
        return apiResponse.success();
      } else if (req.query.filter) {
        const usersTotal = await User.find(query).count();
        // Pagination
        const LIMIT = 50;
        let SKIP = 0;

        if (req.query.page) {
          SKIP = Number(req.query.page);
        }
        const totalPage = usersTotal / LIMIT;
        let nextPage = `&page=${SKIP + LIMIT}`;
        let prevPage = null;

        if (SKIP >= usersTotal) {
          nextPage = null;
        }
        if ((SKIP + LIMIT) >= totalPage) {
          nextPage = null;
        }
        if (SKIP > 0) {
          prevPage = `&page=${SKIP - LIMIT}`;
        }
        const pagination = {
          nextPage,
          prevPage,
        };
        const users = await User.find(query).skip(SKIP).limit(LIMIT);
        if (users.length !== 0) {
          const apiResponse = new ApiResponse(
            res,
            { users, pagination, success: 'Fetch Users' },
            200,
          );
          return apiResponse.success();
        }
        const apiResponse = new ApiResponse(res, {
          error: 'No users found',
        }, 404);
        return apiResponse.failure();
      }
      const users = await User.find({ typeUser: 'student' });
      if (users.length !== 0) {
        const apiResponse = new ApiResponse(res, {
          users,
          success: 'Fetch Users',
        }, 200);
        return apiResponse.success();
      }
      const apiResponse = new ApiResponse(res, {
        error: 'No users found',
      }, 404);
      return apiResponse.failure();
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async show(req, res, next) {
    const { id } = req.params;
    try {
      const user = await User.findById(id, { password: 0 })
        .populate({
          path: 'teams',
          model: 'team',
          select: 'users manager',
          populate: {
            path: 'users.user',
            model: 'user',
            select: 'fullName picture',
          },
        })
        .populate({
          path: 'teams',
          model: 'team',
          populate: {
            path: 'project',
            model: 'project',
            select: 'title',
          },
        });
      const apiResponse = new ApiResponse(res, user, 200);
      return apiResponse.success();
    } catch (error) {
      next(error);
    }
  },
  async edit(req, res) {
    const userId = req.params.id;
    const userProps = req.body;
    module.exports.imageControl(req, res);
    const props = module.exports.buildEditProps(userProps);
    const options = { runValidators: true, upsert: true };
    try {
      if (res.locals.user._id.toString() !== userId) {
        const apiResponse = new ApiResponse(res, null, 403);
        return apiResponse.failure();
      }

      await User.update({ _id: userId }, { $set: props }, options);
      const userUpdated = await User.findById({ _id: userId }, { password: 0 })
        .populate({
          path: 'teams',
          select: 'users name',
          populate: {
            path: 'users.user',
            model: 'user',
            select: 'fullName picture',
          },
        });
      if (!userUpdated) {
        const apiResponse = new ApiResponse(res, {
          error: 'No users found',
        }, 404);
        return apiResponse.failure();
      }
      const fieldUpdated = Object.keys(props)[0];

      const apiResponse = new ApiResponse(res, { user: userUpdated, success: fieldUpdated }, 200);
      return apiResponse.success();
    } catch (error) {
      const apiResponse = new ApiResponse(res, 400);
      return apiResponse.failure(error);
    }
  },

  async delete(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.findByIdAndRemove({ _id: userId });
      if (user) {
        const apiResponse = new ApiResponse(res, { success: 'Delete' }, 204);
        return apiResponse.success();
      }
    } catch (error) {
      const apiResponse = new ApiResponse(res, 400);
      return apiResponse.failure(error);
    }
  },
  // Utils Function
  imageControl(req, res) {
    const imageTypeRegularExpression = /\/(.*?)$/;
    if (req.body.picture) {
      const imageBuffer = module.exports.decodeBase64Image(req.body.picture);
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
      return true;
    }
    return true;
  },
  decodeBase64Image(dataString) {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');

    return response;
  },
  buildEditProps(userProps) {
    const hasCompanyProperty = Object.prototype.hasOwnProperty.call(userProps, 'company');
    let props = {};
    if (hasCompanyProperty) {
      Object.keys(userProps).map((key) => {
        Object.keys(userProps[key]).map((propKey) => {
          props = {
            ...props,
            [`${propKey}`]: userProps[key][propKey],
          };
          return props;
        });
        return true;
      });
    } else {
      props = userProps;
    }
    return props;
  },
};
