import React from 'react';
import PropTypes from 'prop-types';
import './inputFile.css';
import SuccessIcon from '../../assets/successIcon/successIcon';

const InputFile = ({ config }) => {
  const {
    field,
    onChange,
  } = config;
  return (
    <div className="form-group">
      <div className="input-file-label-container">
        <label className="input-file-label" htmlFor={field.name}>{field.label}</label>
      </div>
      <input
        name={field.name}
        id={field.name}
        className="form-control picture-upload"
        type="file"
        onChange={onChange}
        onBlur={config.blur}
        onFocus={config.focus}
        accept={config.typeFileAccepted}
      />
      {config.success === config.field.name && <SuccessIcon />}
      {config.error && <small className="error-message">{config.error}</small>}
    </div>
  );
};

InputFile.propTypes = {
  config: PropTypes.object.isRequired,
};

export default InputFile;

