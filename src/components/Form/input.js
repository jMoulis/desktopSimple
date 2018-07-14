import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SuccessIcon from '../../assets/successIcon/successIcon';
import './input.css';

const Input = ({ config }) => {
  return (
    <div className={classNames(`form-group ${config.field.required ? 'required' : ''}`, config.parentClassName)}>
      {config.field.label && <label htmlFor={config.field.name}>{config.field.label}</label>}
      <input
        type={config.field.type}
        name={config.field.name}
        id={config.field.name}
        value={config.value || ''}
        placeholder={config.field.placeholder ? config.field.placeholder : config.field.label}
        onChange={config.onChange}
        className={classNames(`form-control ${config.error ? 'form-control-error' : ''}`, config.className)}
        onBlur={config.blur}
        onFocus={config.focus}
        onKeyUp={config.keyUp}
        readOnly={config.readOnly}
        onKeyPress={config.keyPress}
        max={config.max}
        min={config.min}
      />
      {config.success && config.success === config.field.name && <SuccessIcon />}
      {config.small && <small className="tips">{config.small}</small>}
      {config.error && <small className="error-message">{config.error}</small>}
    </div>
  );
};

Input.propTypes = {
  config: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};


export default Input;
