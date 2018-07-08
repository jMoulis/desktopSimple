const User = require('../models/User');
const ApiResponse = require('../service/api/apiResponse');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.user._id);
    const fieldsMandatory = [
      'companyName',
      'street',
      'postalCode',
      'town',
      'description',
      'legalDocs',
    ];
    const userKeysArray = Object.keys(user.company._doc);
    const arrayController = [];
    userKeysArray.map((key) => {
      if (fieldsMandatory.includes(key)) {
        return arrayController.push(key);
      }
      return arrayController;
    });
    if (arrayController.length < fieldsMandatory.length) {
      const apiResponse = new ApiResponse(res, {
        error: 'Not allowed, please fill in company information',
      }, 403);
      return apiResponse.failure();
    }
    return next();
  } catch (error) {
    next(error);
  }
};
