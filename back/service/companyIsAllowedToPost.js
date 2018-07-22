const User = require('../models/User');
const ApiResponse = require('../service/api/apiResponse_v2');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.user._id);
    const apiResponse = new ApiResponse(res);
    const fieldsMandatory = [
      'companyName',
      'street',
      'postalCode',
      'town',
      'description',
      'legalDocs',
    ];
    if (user.company) {
      const userKeysArray = Object.keys(user.company._doc);
      const arrayController = [];
      userKeysArray.map((key) => {
        if (fieldsMandatory.includes(key)) {
          return arrayController.push(key);
        }
        return arrayController;
      });
      if (arrayController.length < fieldsMandatory.length) {   
        return apiResponse.failure(403, {
          error: 'Not allowed, please fill in company information',
        });
      }
    } else {
      return apiResponse.failure(403, {
        error: 'Not allowed',
      });
    }
  } catch (error) {
    console.log(error.message)
    next(error);
  }
};
