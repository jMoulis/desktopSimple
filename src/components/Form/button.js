import React from 'react';
import PropTypes from 'prop-types';

import './button.css';

const Button = ({ label, loading, disabled }) => (
  <button
    type="submit"
    disabled={disabled && true}
    className={`btn btn-form ${disabled && 'disabled'}`}
  >
    {loading ? <i className="fas fa-spinner" /> : label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};
Button.defaultProps = {
  disabled: false,
};

export default Button;
