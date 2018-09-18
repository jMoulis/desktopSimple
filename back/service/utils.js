const fs = require('fs');
const shell = require('shelljs');

module.exports = {
  isObjectEmpty: object => {
    if (Object.keys(object).length > 0) return false;
    return true;
  },
  createFile: (rootFolder, fileName, document) => {
    if (fs.existsSync(root)) {
      fs.writeFileSync(`${root}/${fileName}`, document.buffer);
    } else {
      shell.mkdir('-p', root);
      fs.writeFileSync(`${root}/${fileName}`, document.buffer);
    }
  },
  isUndefined: value => {
    if (typeof value !== 'undefined') return false;
    return true;
  },
};
