import React from 'react';
import PropTypes from 'prop-types';

import './button.css';

const Button = ({ label, loading }) => (
  <button
    type="submit"
    disabled={loading && true}
    className={`btn btn-form ${loading && 'disabled'}`}
  >
    {loading ? <i className="fas fa-spinner" /> : label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Button;
