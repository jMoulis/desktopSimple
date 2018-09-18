import React from 'react';

class Utils {
  cleanUpFormsDataBeforePost = form => {
    let formData = {};
    Object.keys(form).forEach(input => {
      formData = { ...formData, [input]: form[input].value };
    });
    return formData;
  };
  buildUrlFilter = filter => {
    if (!filter) return false;
    let filters = [];
    Object.keys(filter).forEach(key => {
      if (key === 'repository') {
        // repository is a specific key has to replace each other
        const repository = filter[key];
        const keyInRepositoryObject = Object.keys(repository);
        const value = Object.values(repository)[0];
        filters = [...filters, `${keyInRepositoryObject}=${value}`];
      } else if (
        typeof filter[key] !== 'undefined' &&
        !this.isEmptyString(filter[key])
      ) {
        filters = [...filters, filter[key] && `${key}=${filter[key]}`];
      }
    });
    if (filters.length <= 0) return false;
    return `?${filters.toString().replace(/,/g, '&')}`;
  };
  simulateClickEvent = file => {
    const element = document.createElement('a');
    element.href = file.fileContent;
    element.setAttribute('download', `${file.originalName}`);
    return this._linkClick(element, 'click');
  };
  _linkClick = element => {
    const eventObject = new MouseEvent('click');
    element.addEventListener('click', null);
    element.dispatchEvent(eventObject);
  };
  extension = (doc, options, action) => {
    const word = ['doc', 'docx', 'odt', 'ott'];
    const excel = ['xls', 'xlsx', 'ods', 'ots'];
    const powerpoint = ['ppt', 'pptx', 'odp', 'otp'];
    const image = ['jpeg', 'png', 'gif', 'jpg'];
    const pdf = ['pdf'];
    if (!doc.extension) return 'alt';
    if (word.includes(doc.extension) && !options.word)
      return (
        <i
          className="far fa-file-word fa-3x"
          onClick={() => {
            action(doc.url);
          }}
          onKeyDown={() => {
            action(doc.url);
          }}
        />
      );
    if (pdf.includes(doc.extension) && !options.pdf)
      return (
        <i
          className="far fa-file-word fa-3x"
          onClick={() => {
            action(doc.url);
          }}
          onKeyDown={() => {
            action(doc.url);
          }}
        />
      );
    if (excel.includes(doc.extension) && !options.excel)
      return (
        <i
          className="far fa-file-excel fa-3x"
          onClick={() => {
            action(doc.url);
          }}
          onKeyDown={() => {
            action(doc.url);
          }}
        />
      );
    if (powerpoint.includes(doc.extension) && !options.powerpoint)
      return (
        <i
          className="far fa-file-powerpoint fa-3x"
          onClick={() => {
            action(doc.url);
          }}
          onKeyDown={() => {
            action(doc.url);
          }}
        />
      );
    if (image.includes(doc.extension) && !options.image)
      return (
        <i
          className="far fa-file-image fa-3x"
          onClick={() => {
            action(doc.url);
          }}
          onKeyDown={() => {
            action(doc.url);
          }}
        />
      );
    return (
      <i
        className="far fa-file fa-3x"
        onClick={() => {
          action(doc.url);
        }}
        onKeyDown={() => {
          action(doc.url);
        }}
      />
    );
  };
  isImage = ext => {
    const image = ['jpeg', 'png', 'gif', 'jpg'];
    if (image.includes(ext)) return true;
    return false;
  };
  isObjectEmpty = object => {
    if (!object) return true;
    if (Object.keys(object).length === 0) return true;
    return false;
  };
  isEmptyString = string => {
    if (string.length > 0) return false;
    return true;
  };
}

export default Utils;
