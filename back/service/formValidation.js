const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

module.exports = class FormValidate {
  constructor(formFields, model) {
    // Fetch all the inputs
    this.formFields = formFields;
    // Control if the inputs ar part of the model
    this.model = model;
  }

  validate() {
    // I fetch sent fields
    const fields = Object.keys(this.formFields);
    // If fetch the fields in the model
    const modelFields = Object.keys(this.model.schema.obj);
    let truthyArray = [];
    // For each model fields I check how many fields are equal to the model
    // and return an array with total of true
    modelFields.map((modelField) => {
      fields.filter((field) => {
        if (modelField === field) {
          truthyArray = [...truthyArray, true];
          return truthyArray;
        }
        return truthyArray;
      });
    });
    // Now I check if there's the same lenght item in the truthy array and the formfields
    // If not, it means that a fake input has been added.
    if (truthyArray.length !== fields.length) {
      return false;
    }
    return true;

    // return true or false
    // return the escaped field
  }
  controlFieldPresence() {

  }
  someCleanUp() {
    // Escape all fields

  }
};
