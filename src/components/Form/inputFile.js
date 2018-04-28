import React from 'react';
import PropTypes from 'prop-types';

const InputFile = ({ config }) => {
  const {
    field,
    onChange,
  } = config;
  return (
    <div className={`form-group ${field.required && 'required'}`}>
      {field.label && <label className="label-top" htmlFor={field.name}>{field.label}</label>}
      <input
        name={field.name}
        id={field.name}
        className="form-control"
        type="file"
        onChange={onChange}
      />
    </div>
  );
};

InputFile.propTypes = {
  config: PropTypes.object.isRequired,
};

export default InputFile;

