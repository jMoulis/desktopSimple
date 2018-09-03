import React from 'react';
import PropTypes from 'prop-types';
import SuccessIcon from '../../assets/successIcon/successIcon';

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
  } = config;
  return (
    <div className={`form-group ${config.required && 'required'}`}>
      {field.label && <label className="label-top">{field.label}</label>}
      <select
        id={field.name}
        name={field.name}
        className="form-control form-control-top"
        onChange={onChange}
        value={value}
        multiple={multiple}
        onBlur={blur}
        onFocus={focus}
        readOnly={config.readOnly}
      >
        <option value="">{field.defaultOption}</option>
        {options.map((option, index) => (
          <option key={index} value={option.toLowerCase().replace(' ', '')}>
            {option}
          </option>
        ))}
      </select>
      {config.success === config.field.name && <SuccessIcon />}
      {error && <small className="error-message">{error}</small>}
    </div>
  );
};

Select.propTypes = {
  config: PropTypes.object.isRequired,
};

export default Select;
