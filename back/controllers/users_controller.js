const User = require('../models/User');
const Meta = require('../models/Meta');
const ApiResponse = require('../service/api/apiResponse');
const ApiResponse2 = require('../service/api/apiResponse_v2');

module.exports = {
  async index(req, res) {
    const apiResponse2 = new ApiResponse2(res);
    try {
      const query = {
        available: true,
        typeUser: 'student',
      };

      if (req.query.count && req.query.filter) {
        const usersCount = await User.find({
          ...query,
          tags: { $in: [req.query.filter] },
        }).count();
        return apiResponse2.success(200, {
          count: {
            key: req.query.filter,
            count: usersCount,
          },
          success: 'Count',
        });
      } else if (req.query.filter) {
        const usersTotal = await User.find({
          ...query,
          tags: { $in: [req.query.fi3lter] },
        }).count();
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
        if (SKIP + LIMIT >= totalPage) {
          nextPage = null;
        }
        if (SKIP > 0) {
          prevPage = `&page=${SKIP - LIMIT}`;
        }
        const pagination = {
          nextPage,
          prevPage,
        };
        const users = await User.find({
          ...query,
          tags: { $in: [req.query.filter] },
        })
          .skip(SKIP)
          .limit(LIMIT);
        if (users.length !== 0) {
          return apiResponse2.success(200, {
            users,
            pagination,
          });
        }
        return apiResponse2.failure(404, null, 'No users found');
      }

      const users = await User.find(query);
      if (users.length !== 0) {
        return apiResponse2.success(200, {
          users,
        });
      }
      return apiResponse2.failure(404, null, 'No users found');
    } catch (error) {
      return apiResponse2.failure(422, error);
    }
  },

  async show(req, res, next) {
    const { id } = req.params;
    const apiResponse = new ApiResponse2(res);
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
      if (!user) {
        return apiResponse.failure(404, 'User not found');
      }
      return apiResponse.success(200, { user });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },
  async edit(req, res, next) {
    const userId = req.params.id;
    const userProps = req.body;
    const apiResponse = new ApiResponse2(res);

    module.exports.imageControl(req, res);

    const props = module.exports.buildEditProps(userProps);
    const options = { runValidators: true, upsert: true };

    try {
      if (res.locals.user._id.toString() !== userId) {
        return apiResponse.failure(403, null, 'Not allowed');
      }

      await User.update({ _id: userId }, { $set: props }, options);

      const userUpdated = await User.findById(
        { _id: userId },
        { password: 0 },
      ).populate({
        path: 'teams',
        select: 'users name',
        populate: {
          path: 'users.user',
          model: 'user',
          select: 'fullName picture',
        },
      });

      if (!userUpdated) {
        return apiResponse.failure(404, 'User not found');
      }

      const fieldUpdated = Object.keys(props)[0];

      const keywords = ['school', 'diploma', 'field', 'tags'];

      if (keywords.includes(fieldUpdated)) {
        module.exports.persistMetas(
          fieldUpdated,
          userUpdated[fieldUpdated],
          keywords,
          next,
        );
      }
      return apiResponse.success(200, { user: userUpdated });
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },

  async delete(req, res, next) {
    const userId = req.params.id;
    const apiResponse = new ApiResponse2(res);
    try {
      const user = await User.findByIdAndRemove({ _id: userId });
      if (!user) {
        return apiResponse.failure(422, null, 'Unable to proceed');
      }
      return apiResponse.success(204);
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },

  async persistMetas(fieldUpdated, value, keywords, next) {
    if (keywords.includes(fieldUpdated)) {
      try {
        if (Array.isArray(value)) {
          value.forEach(async val => {
            const isMetaExists = await Meta.findOne({
              metaValue: val.toLowerCase(),
            });
            if (!isMetaExists) {
              Meta.create({
                metaName: fieldUpdated,
                metaValue: val.toLowerCase(),
              });
            }
          });
        } else {
          const isMetaExists = await Meta.findOne({
            metaValue: value.toLowerCase(),
          });
          if (!isMetaExists) {
            await Meta.create({
              metaName: fieldUpdated,
              metaValue: value.toLowerCase(),
            });
          }
        }
      } catch (error) {
        return next(error.message);
      }
    } else {
      return next();
    }
  },
  // async metas(req, res, next) {
  //   let query = {};

  //   if (req.query) {
  //     const regex = new RegExp(`^${req.query.metaValue}`, 'i');
  //     query = { metaName: req.query.metaName, metaValue: { $regex: regex } };
  //   }
  //   try {
  //     const metas = await Meta.find(query);
  //     const apiResponse = new ApiResponse(res, {
  //       metas,
  //       success: 'Fetch Users',
  //     }, 200);
  //     return apiResponse.success();
  //   } catch (error) {
  //     return next(error.message);
  //   }
  // },
  // Utils Function
  imageControl(req, res) {
    const imageTypeRegularExpression = /\/(.*?)$/;
    if (req.body.picture) {
      const imageBuffer = module.exports.decodeBase64Image(req.body.picture);
      const typeUploadedFile = imageBuffer.type.match(
        imageTypeRegularExpression,
      )[1];
      const validFormat = ['jpeg', 'png'];
      if (!validFormat.includes(typeUploadedFile)) {
        const apiResponse = new ApiResponse(
          res,
          {
            picture: {
              status: 400,
              source: { pointer: '/data/attributes/picture' },
              title: 'Bad Request',
              detail: 'Wrong format. Valid format jpg/jpeg/png',
            },
          },
          400,
        );
        return apiResponse.failure();
      }
      return true;
    }
    return true;
  },
  decodeBase64Image(dataString) {
    const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');

    return response;
  },
  buildEditProps(userProps) {
    const hasCompanyProperty = Object.prototype.hasOwnProperty.call(
      userProps,
      'company',
    );
    let props = {};
    if (hasCompanyProperty) {
      Object.keys(userProps).map(key => {
        Object.keys(userProps[key]).map(propKey => {
          props = {
            ...props,
            [`${propKey}`]: userProps[key][propKey],
          };
        });
      });
    } else {
      props = userProps;
    }
    return props;
  },
};
