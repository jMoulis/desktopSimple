import React from 'react';
import PropTypes from 'prop-types';
import './inputFile.css';
import SuccessIcon from '../../assets/successIcon/successIcon';

const InputFile = ({ config }) => {
  const {
    field,
    onChange,
    style,
    styleContainer,
    blur,
    focus,
    success,
    error,
    typeFileAccepted,
  } = config;
  return (
    <div className="form-group" style={styleContainer}>
      <label className="btn btn-success input-file-label" htmlFor={field.name}>
        {field.label}
        <input
          name={field.name}
          id={field.name}
          className="form-control"
          type="file"
          onChange={onChange}
          onBlur={blur}
          onFocus={focus}
          accept={typeFileAccepted}
          style={style}
          onClick={onChange}
        />
      </label>

      {success && success === field.name && <SuccessIcon />}
      {error && <small className="error-message">{error}</small>}
    </div>
  );
};

InputFile.propTypes = {
  config: PropTypes.object.isRequired,
};

export default InputFile;
