import React from 'react';
import PropTypes from 'prop-types';
import './inputFile.css';
import SuccessIcon from '../../assets/successIcon/successIcon';

const InputFile = ({ config }) => {
  const textInput = React.createRef();

  const {
    field,
    onChange,
    style,
    styleContainer,
    styleLabel,
    blur,
    focus,
    success,
    error,
    typeFileAccepted,
  } = config;
  return (
    <div className="form-group" style={styleContainer}>
      <label
        style={styleLabel}
        className="btn btn-success input-file-label  pointer"
        htmlFor={field.name}
      >
        {field.label}
        <input
          ref={textInput}
          name={field.name}
          id={field.name}
          className="form-control pointer"
          type="file"
          onChange={onChange}
          onBlur={blur}
          onFocus={focus}
          accept={typeFileAccepted}
          style={style}
          onClick={onChange}
          value={field.value}
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
