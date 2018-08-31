class Utils {
  cleanUpFormsDataBeforePost = form => {
    let formData = {};
    Object.keys(form).forEach(input => {
      formData = { ...formData, [input]: form[input].value };
    });
    return formData;
  };
  buildUrlFilter = filter => {
    let filters = [];
    Object.keys(filter).forEach(key => {
      if (key === 'repository') {
        // repository is a specific key has to replace each other
        const repository = filter[key];
        const keyInRepositoryObject = Object.keys(repository);
        const value = Object.values(repository)[0];
        filters = [...filters, `${keyInRepositoryObject}=${value}`];
      } else {
        filters = [...filters, `${key}=${filter[key]}`];
      }
    });
    return filters.toString().replace(/,/g, '&');
  };
}

export default Utils;
