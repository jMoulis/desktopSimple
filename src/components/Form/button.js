import React from 'react';

const ButtonLogin = ({ name, logging }) => (
  <button
    type="submit"
    disabled={logging}
    className="btn btn-form"
  >
    {logging ? <i className="fas fa-spinner" /> : 'Sign in'}
  </button>
);

export default ButtonLogin;
