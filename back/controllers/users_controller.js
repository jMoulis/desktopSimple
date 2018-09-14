const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const mime = require('mime');
const shell = require('shelljs');
const mongoose = require('mongoose');
const { isObjectEmpty } = require('../service/utils');

const User = require('../models/User');
const Team = require('../models/Team');
const Meta = require('../models/Meta');
const ApiResponse = require('../service/api/apiResponse_v2');

const ROOT_FOLDER = path.join(__dirname, '/../uploads');

module.exports = {
  async index(req, res) {
    const apiResponse = new ApiResponse(res);
    try {
      const LIMIT = 5;
      let SKIP = 0;
      let query = {};
      if (req.query.filter && !req.query.tags) {
        query = {
          ...query,
          $text: {
            $search: req.query.filter,
            $caseSensitive: false,
          },
        };
      }
      if (req.query.tags) {
        query = {
          ...query,
          tags: req.query.filter,
        };
      }
      if (req.query.available) {
        query = {
          ...query,
          available: true,
        };
      }
      if (req.query.type) {
        query = { ...query, typeUser: req.query.type };
      }

      if (req.query.friends) {
        query = {
          ...query,
          friends: { $in: [res.locals.user._id] },
        };
      }

      if (req.query.sent) {
        query = { ...query, receivedRequest: { $in: [res.locals.user._id] } };
      }
      if (req.query.received) {
        query = { ...query, sentRequest: { $in: [res.locals.user._id] } };
      }

      const usersTotal = await User.find(query).count();
      const totalPage = Math.ceil(usersTotal / LIMIT);
      let nextPage;
      let prevPage;

      if (totalPage !== 1) {
        nextPage = 2;
      }

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
        return apiResponse.success(200, {
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
        return apiResponse.success(200, {
          users,
          pagination,
        });
      }
      return apiResponse.failure(404, null, 'No users found');
    } catch (error) {
      return apiResponse.failure(422, error);
    }
  },

  async show(req, res) {
    const { id } = req.params;
    const apiResponse = new ApiResponse(res);
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
        })
        .populate({
          path: 'files.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'company.files.author',
          model: 'user',
          select: 'fullName picture',
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
    const apiResponse = new ApiResponse(res);
    try {
      const userId = req.params.id;
      let docRemoveUrl;
      const options = { runValidators: true, upsert: true };
      let props = module.exports.buildEditProps(req.body);
      let pictureUrl;
      if (req.body.picture) {
        pictureUrl = module.exports.imageControl(
          req.body.picture,
          res.locals.user._id,
          'avatar',
        );
        if (pictureUrl) {
          props = {
            ...props,
            picture: pictureUrl,
          };
        }
      }
      if (req.body['company.picture']) {
        pictureUrl = module.exports.imageControl(
          req.body['company.picture'],
          res.locals.user._id,
          'logo',
        );
        if (pictureUrl) {
          props = {
            ...props,
            'company.picture': pictureUrl,
          };
        }
      }
      if (res.locals.user._id.toString() !== userId) {
        return apiResponse.failure(403, null, 'Not allowed');
      }

      if (Object.prototype.hasOwnProperty.call(req.body, 'files')) {
        const deleteDocumentQuery = await module.exports.deleteFile(
          req.body,
          'files',
        );
        props = deleteDocumentQuery.query;
        docRemoveUrl = deleteDocumentQuery.docUrl;
      }

      if (Object.prototype.hasOwnProperty.call(req.body, 'company.files')) {
        const deleteDocumentQuery = await module.exports.deleteFile(
          req.body,
          'files',
          'company',
        );
        props = deleteDocumentQuery.query;
        docRemoveUrl = deleteDocumentQuery.docUrl;
      }

      if (req.files && !isObjectEmpty(req.files)) {
        const filesKey = Object.keys(req.files)[0];
        let files = [];
        files = await req.files[filesKey].map(document => {
          const fileName = `${document.fieldname}-${uuidv4()}.${mime.extension(
            document.mimetype,
          )}`;

          const fullPath = `${ROOT_FOLDER}/users/${res.locals.user._id}/files`;

          if (fs.existsSync(fullPath)) {
            fs.writeFileSync(`${fullPath}/${fileName}`, document.buffer);
          } else {
            shell.mkdir('-p', fullPath);
            fs.writeFileSync(`${fullPath}/${fileName}`, document.buffer);
          }

          return {
            originalName: document.originalname,
            name: fileName,
            extension: mime.extension(document.mimetype),
            mimetype: document.mimetype,
            folder: `/users/${res.locals.user._id}/files/${fileName}`,
            author: res.locals.user._id,
            createdAt: new Date(),
            url: `/users/${userId}/files/${fileName}`,
            type: 'users',
          };
        });
        props = {
          ...props,
          $push: {
            [filesKey]: [...files],
          },
        };
      }

      console.log(props);
      if (Object.prototype.hasOwnProperty.call(props, 'tags')) {
        props = {
          ...props,
          tags: props.tags ? props.tags.split(',') : [],
        };
      }
      if (Object.prototype.hasOwnProperty.call(props, 'company.tags')) {
        props = {
          ...props,
          'company.tags': props['company.tags']
            ? props['company.tags'].split(',')
            : [],
        };
      }
      await User.update({ _id: userId }, props, options);

      // Remove file from filesystem after updating
      if (docRemoveUrl) {
        shell.rm(`${ROOT_FOLDER}${docRemoveUrl}`);
      }

      const userUpdated = await User.findById({ _id: userId }, { password: 0 })
        .populate({
          path: 'teams',
          select: 'users name',
          populate: {
            path: 'users.user',
            model: 'user',
            select: 'fullName picture',
          },
        })
        .populate({
          path: 'files.author',
          model: 'user',
          select: 'fullName picture',
        })
        .populate({
          path: 'company.files.author',
          model: 'user',
          select: 'fullName picture',
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
      return apiResponse.failure(422, error, error.message);
    }
  },

  async deleteFile(body, keyDocs, subDocument) {
    let key = `${keyDocs}`;

    if (subDocument) {
      key = `${subDocument}.${keyDocs}`;
    }
    const documentUser = await User.findOne(
      {
        [`${key}._id`]: body[key],
      },
      { [key]: 1 },
    );
    if (!documentUser) return Error('No user found');

    let arrayToFindIn = documentUser[keyDocs];
    if (subDocument) {
      arrayToFindIn = documentUser[subDocument][keyDocs];
    }
    const document = arrayToFindIn.find(
      doc => doc._id.toString() === body[key],
    );
    if (!document) return Error('No document found');
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
  async delete(req, res) {
    const userId = req.params.id;
    const apiResponse = new ApiResponse(res);
    try {
      await Team.update(
        {
          'users.user': mongoose.Types.ObjectId(userId),
        },
        {
          $pull: {
            users: { user: mongoose.Types.ObjectId(userId) },
          },
        },
      );

      await User.updateMany(
        {
          $or: [
            { receivedRequest: { $in: userId } },
            { friends: { $in: userId } },
          ],
        },
        {
          $pull: {
            receivedRequest: userId,
            friends: userId,
          },
        },
      );

      const user = await User.findByIdAndRemove({ _id: userId });

      if (!user) {
        return apiResponse.failure(422, null, 'Unable to proceed');
      }

      await shell.rm('-R', `${ROOT_FOLDER}/users/${user._id}`);
      // return apiResponse.failure(422);
      return apiResponse.success(204);
    } catch (error) {
      console.log(error.message);
      return apiResponse.failure(422, error);
    }
  },

  async friendsRequest(req, res) {
    const sender = res.locals.user._id;
    const { userId, type } = req.body;
    const apiResponse = new ApiResponse(res);
    let querySender = {};
    let queryFriend = {};
    try {
      switch (type) {
        case 'cancel': {
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
          break;
        }
        case 'request': {
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
          break;
        }
        case 'decline': {
          querySender = {
            query: {
              _id: sender,
            },
            action: {
              $pull: {
                receivedRequest: userId,
              },
              $push: {
                declinedRequest: userId,
              },
            },
          };
          queryFriend = {
            query: {
              _id: userId,
            },
            action: {
              $pull: {
                sentRequest: sender,
              },
            },
          };
          break;
        }
        case 'accept': {
          querySender = {
            query: {
              _id: sender,
            },
            action: {
              $push: {
                friends: userId,
              },
              $pull: {
                receivedRequest: userId,
                declinedRequest: userId,
              },
            },
          };
          queryFriend = {
            query: {
              _id: userId,
            },
            action: {
              $pull: {
                sentRequest: sender,
              },
              $push: {
                friends: sender,
              },
            },
          };
          break;
        }
        case 'delete': {
          querySender = {
            query: {
              _id: sender,
            },
            action: {
              $pull: {
                friends: userId,
              },
            },
          };
          queryFriend = {
            query: {
              _id: userId,
            },
            action: {
              $pull: {
                friends: sender,
              },
            },
          };
          break;
        }
        default:
      }

      await User.update(querySender.query, querySender.action);

      await User.update(queryFriend.query, queryFriend.action);

      const userChanged = await User.findOne({ _id: userId }, { password: 0 });

      if (!userChanged) {
        return apiResponse.failure(404, 'User not found');
      }

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
  imageControl(picture, userId, type) {
    const imageTypeRegularExpression = /\/(.*?)$/;
    const validImageType = ['image/png', 'image/jpeg', 'image/jpg'];

    if (picture) {
      const imageBuffer = module.exports.decodeBase64Image(picture);
      const typeUploadedFile = imageBuffer.type.match(
        imageTypeRegularExpression,
      )[1];

      if (!validImageType.includes(imageBuffer.type)) {
        const apiResponse = new ApiResponse();
        return apiResponse.failure(
          422,
          null,
          'Wrong format. Valid format jpg/jpeg/png',
        );
      }

      const destination = `${ROOT_FOLDER}/users/${userId}`;
      const fileName = `${type}-${uuidv4()}.${typeUploadedFile}`;
      try {
        if (fs.existsSync(destination)) {
          fs.writeFileSync(`${destination}/${fileName}`, imageBuffer.data);
        } else {
          shell.mkdir('-p', destination);
          fs.writeFileSync(`${destination}/${fileName}`, imageBuffer.data);
        }
      } catch (error) {
        console.log(error.message);
      }

      return `/users/${userId}/${fileName}`;
    }
    return null;
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
