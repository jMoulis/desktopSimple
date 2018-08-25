class Utils {
  cleanUpFormsDataBeforePost = form => {
    let formData = {};
    Object.keys(form).forEach(input => {
      formData = { ...formData, [input]: form[input].value };
    });
    return formData;
  };
  buildUrlFilter = filter => {
    console.log(filter);
    let filters = [];
    Object.keys(filter).forEach(key => {
      filters = [...filters, `${key}=${filter[key]}`];
    });
    return filters.toString().replace(/,/g, '&');
  };
}

export default Utils;
