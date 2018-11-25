import React from 'react';
import PropTypes from 'prop-types';
import SuccessIcon from '../../assets/successIcon/successIcon';
import './select.css';

const Select = ({ config }) => {
  const {
    field,
    onChange,
    value,
    multiple,
    error,
    blur,
    focus,
    options,
    cssContainer,
    cssInput,
    style,
    small,
    containerStyle,
    required,
    success,
    readOnly,
  } = config;
  return (
    <div
      className={`form-group ${required ? 'required' : ''} ${cssContainer ||
        ''} ${small ? 'form-group-small' : ''}`}
      style={containerStyle}
    >
      {field.label && (
        <label className="label-top form-label">{field.label}</label>
      )}
      <select
        id={field.name}
        name={field.name}
        className={`select form-control form-control-top ${
          small ? `select-small` : ''
        } ${cssInput || ''}`}
        onChange={onChange}
        value={value}
        multiple={multiple}
        onBlur={blur}
        onFocus={focus}
        readOnly={readOnly}
        style={style}
      >
        <option value="">{field.defaultOption}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {success === field.name && <SuccessIcon />}
      {error && <small className="error-message">{error}</small>}
    </div>
  );
};

Select.propTypes = {
  config: PropTypes.object.isRequired,
};

export default Select;
