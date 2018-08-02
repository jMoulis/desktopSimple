const multer = require('multer');
const mime = require('mime');
const fs = require('fs');

const mimeTypesAuthorized = ['jpeg', 'jpg', 'pdf', 'doc', 'docx'];
const validate = mimetype => {
  if (mimeTypesAuthorized.includes(mimetype)) {
    return true;
  }
  return false;
};

const ROOT_FOLDER = 'back/uploads/';
module.exports = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const root = `${ROOT_FOLDER}${req.headers.type}`;
      const destination = `${ROOT_FOLDER}${req.headers.type}/${
        req.headers.folder
      }`;
      if (fs.existsSync(root)) {
        if (fs.existsSync(destination)) {
          cb(null, destination);
        } else {
          fs.mkdirSync(destination);
          cb(null, destination);
        }
      } else {
        fs.mkdirSync(root);
        fs.mkdirSync(destination);
        cb(null, destination);
      }
    },
    filename: (req, file, cb) => {
      if (validate(mime.extension(file.mimetype))) {
        return cb(
          null,
          `${file.fieldname}-${Date.now()}.${mime.extension(file.mimetype)}`,
        );
      }
      return cb(new Error('Wrong file format'));
    },
  }),
  upload: multer({ storage: module.exports.storage }),
};
