const User = require('../models/User');
const Meta = require('../models/Meta');
const ApiResponse = require('../service/api/apiResponse');
const ApiResponse2 = require('../service/api/apiResponse_v2');

module.exports = {
  async index(req, res) {
    const apiResponse2 = new ApiResponse2(res);
    try {
      const LIMIT = 5;
      let SKIP = 0;

      let query = {
        available: true,
      };

      if (req.query.filter) {
        query = {
          ...query,
          $text: { $search: req.query.filter, $caseSensitive: false },
        };
      }

      if (req.query.type) {
        query = { ...query, typeUser: req.query.type };
      }

      const usersTotal = await User.find(query).count();
      const totalPage = Math.ceil(usersTotal / LIMIT);

      let nextPage = 2;
      let prevPage = null;

      if (req.query.page) {
        if (Number(req.query.page) + 1 > totalPage) {
          nextPage = null;
        } else {
          nextPage = Number(req.query.page) + 1;
        }
        if (Number(req.query.page) - 1 === 0) {
          prevPage = null;
        } else {
          prevPage = Number(req.query.page) - 1;
        }
        SKIP = (req.query.page - 1) * LIMIT;
      }
      const pagination = {
        nextPage,
        prevPage,
        count: usersTotal,
      };

      if (req.query.count && req.query.filter) {
        return apiResponse2.success(200, {
          count: {
            key: req.query.filter,
            count: usersTotal,
          },
          success: 'Count',
        });
      }
      const users = await User.find(query, { password: 0 })
        .sort(
          req.query.sorting ? { fullName: req.query.sorting } : { fullName: 1 },
        )
        .skip(SKIP)
        .limit(LIMIT);

      if (users.length !== 0) {
        return apiResponse2.success(200, {
          users,
          pagination,
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
      return apiResponse.success(200, { user: userUpdated }, fieldUpdated);
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

  async friendsRequest(req, res) {
    const sender = res.locals.user._id;
    const { userId, type } = req.body;
    const apiResponse = new ApiResponse2(res);
    console.log(req.body);
    // Cases:
    // Ask friend = add receiver to sender sentRequest & add sender to receiver receivedRequest
    // Accept request = remove receiver receiveRequest & add sender to friend & remove sender sentRequest
    // Decline request = update
    // Cancel request
    // Fetch id of friend request
    // Add friend id to sentFriendRquest
    let querySender = {};
    let queryFriend = {};
    try {
      if (type === 'cancel') {
        querySender = {
          query: {
            _id: sender,
          },
          action: {
            $pull: {
              sentRequest: userId,
            },
          },
        };

        queryFriend = {
          query: {
            _id: userId,
          },
          action: {
            $pull: {
              receivedRequest: sender,
            },
          },
        };
      } else if (type === 'request') {
        querySender = {
          query: {
            _id: sender,
            sentRequest: {
              $nin: [userId],
            },
          },
          action: {
            $push: {
              sentRequest: userId,
            },
          },
        };
        queryFriend = {
          query: {
            _id: userId,
            receivedRequest: {
              $nin: [sender],
            },
          },
          action: {
            $push: {
              receivedRequest: sender,
            },
          },
        };
      }
      await User.update(querySender.query, querySender.action);
      await User.update(queryFriend.query, queryFriend.action);
      const userChanged = await User.findOne({ _id: userId }, { password: 0 });
      return apiResponse.success(201, { user: userChanged }, true);
    } catch (error) {
      return apiResponse.failure(422, null, error.message);
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
