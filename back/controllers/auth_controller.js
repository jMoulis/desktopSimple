const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const loadFakeUser = require('../service/fakeData');
const User = require('../models/User');
const ApiResponse = require('../service/api/apiResponse');

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      // if (process.env.NODE_ENV !== 'test') {
      //   const fakeUsers = loadFakeUser();
      //   User.deleteMany({ fake: true }).then(() => {
      //     User.insertMany(fakeUsers);
      //   });
      // }
      if (!existingUser) {
        const apiResponse = new ApiResponse(res, {
          login: {
            source: { pointer: '/data/attributes/athentification' },
            detail: 'Incorrect username or password.',
          },
          auth: false,
          token: null,
        }, 401);
        return apiResponse.failure();
      }
      const passwordIsValid = bcrypt.compareSync(password, existingUser.password);

      if (!passwordIsValid) {
        const apiResponse = new ApiResponse(res, {
          login: {
            source: { pointer: '/data/attributes/athentification' },
            detail: 'Incorrect username or password.',
          },
          auth: false,
          token: null,
        }, 401);
        return apiResponse.failure();
      }
      const token = jwt.sign({ user: { _id: existingUser._id }, auth: true }, config.secret, {
        expiresIn: 86400,
      });
      // This second find request to fetch the user without password
      // it's needed because the first existingUser needs the password to be compared
      // in the password bcrypt
      const user = await User.findOne({ _id: existingUser._id }, { password: 0 })
        .populate({
          path: 'teams',
          model: 'team',
          select: 'name users manager',
          populate: ({
            path: 'users.user',
            model: 'user',
            select: 'fullName picture',
          }),
        })
        .populate({
          path: 'teams',
          model: 'team',
          populate: ({
            path: 'project',
            model: 'project',
            select: 'title',
          }),
        });
      const apiResponse = new ApiResponse(res, {
        token,
        user,
      }, 200);
      return apiResponse.success();
    } catch (error) {
      const apiResponse = new ApiResponse(res, 500);
      return apiResponse.failure(error);
    }
  },
  async register(req, res) {
    const {
      email,
      fullName,
      typeUser,
      password,
    } = req.body;
    try {
      const existingUser = await User.findOne({ email }, { password: 0 });
      if (existingUser) {
        return res.status('409').send({
          errors: {
            email: {
              status: 409,
              source: '/register',
              title: 'Email already exists',
              detail: 'Email already exists, please pick another one or sign in',
            },
          },
        });
      }
      let hashedPassword;
      if (password) {
        hashedPassword = bcrypt.hashSync(password, 10);
      }
      const newUser = await User.create({
        email,
        fullName,
        typeUser,
        password: hashedPassword,
      });
      const token = jwt.sign({ user: { _id: newUser._id }, auth: true }, config.secret, {
        expiresIn: 86400,
      });
      const apiResponse = new ApiResponse(res, {
        token,
        user: newUser,
      }, 201);
      return apiResponse.success();
    } catch (error) {
      const apiResponse = new ApiResponse(res, 500);
      return apiResponse.failure(error);
    }
  },
  async changePassword(req, res, next) {
    const {
      actualPassword,
      newPassword,
    } = req.body;
    try {
      const existingUser = await User.findOne({ _id: res.locals.user._id });
      if (!existingUser) {
        const apiResponse = new ApiResponse(res, {
          source: { pointer: '/data/attributes/athentification' },
          detail: 'No user found',
          auth: false,
          token: null,
        }, 401);
        return apiResponse.failure();
      }
      let passwordIsValid = false;
      if (actualPassword) {
        passwordIsValid = bcrypt.compareSync(actualPassword.value, existingUser.password);
      }

      if (!passwordIsValid) {
        const apiResponse = new ApiResponse(res, {
          actualPassword: {
            source: { pointer: '/data/attributes/athentification' },
            detail: 'Incorrect password',
            auth: false,
            token: null,
          },
        }, 401);
        return apiResponse.failure();
      }
      let hashedPassword;
      if (newPassword.value) {
        hashedPassword = bcrypt.hashSync(newPassword.value, 10);
      }
      User.update({ _id: existingUser._id }, { password: hashedPassword }, (error) => {
        if (error) {
          const apiResponse = new ApiResponse(res, 400);
          return apiResponse.failure(error);
        }
      })
        .then(() => User.findById({ _id: existingUser._id }, { password: 0 }))
        .then(() => {
          const apiResponse = new ApiResponse(res, { success: 'Password changed' }, 200);
          return apiResponse.success();
        })
        .catch(next);
    } catch (error) {
      const apiResponse = new ApiResponse(res, 500);
      return apiResponse.failure(error);
    }
  },
};
