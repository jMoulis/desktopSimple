module.exports = {
  success(data) {
    return {
      data,
      success: true,
    };
  },

  failure(error) {
    let errorsApi = {};
    if (error.errors) {
      Object.keys(error.errors).map(key => {
        const err = error.errors[key].message;
        errorsApi = {
          ...errorsApi,
          [key]: err,
        };
      });
    } else {
      errorsApi = {
        other: 'Error while processing',
      };
    }
    return errorsApi;
  },
};
