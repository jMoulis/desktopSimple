import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  name,
  label,
  value,
  onChange,
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      className="form-control"
      type={name}
      name={name}
      id={name}
      value={value}
      placeholder={label}
      onChange={onChange}
    />
  </div>
);

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Input;
