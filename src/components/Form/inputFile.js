import React from 'react';
import PropTypes from 'prop-types';

const InputFile = ({ config }) => {
  const {
    field,
    onChange,
  } = config;
  return (
    <div className={`form-group ${field.required && 'required'}`}>
      <div className="input-file-label-container">
        <label className="input-file-label" htmlFor={field.name}>Choose your picture</label>
      </div>
      <input
        name={field.name}
        id={field.name}
        className="form-control"
        type="file"
        onChange={onChange}
        onBlur={config.blur}
        onFocus={config.focus}
      />
    </div>
  );
};

InputFile.propTypes = {
  config: PropTypes.object.isRequired,
};

export default InputFile;

