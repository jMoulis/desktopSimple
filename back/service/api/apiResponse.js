const statusText = require('./statusText');

module.exports = class ApiResponse {
  constructor(res, data = null, statusCode = 400) {
    this.statusCode = statusCode;
    this.res = res;
    this.data = data;
    this.title = statusText[statusCode]
      ? statusText[statusCode].text
      : 'Unknown status code :(';
  }

  success() {
    this.res.set({
      'Content-Type': 'application/json',
    });
    return this.res.status(this.statusCode).send(this.data);
  }

  failure(err) {
    let errorsApi = {};
    if (typeof err !== 'undefined' && err) {
      if (err.errors) {
        Object.keys(err.errors).map(key => {
          const error = {
            status: this.statusCode,
            source: { pointer: `/data/attributes/${key}` },
            title: this.title,
            detail: err.errors[key].message,
          };
          errorsApi = {
            ...errorsApi,
            [key]: error,
          };
        });
      } else if (err.name === 'CastError') {
        if (err.kind === 'date') {
          errorsApi = {
            ...errorsApi,
            [err.path]: {
              detail: 'Wrong date format JJ/MM/YYYY',
            },
          };
        }
      }
    } else {
      errorsApi = {
        ...this.data,
      };
    }
    this.res.set({
      'Content-Type': 'application/json',
    });
    return this.res.status(this.statusCode).send({ errors: errorsApi });
  }
};
