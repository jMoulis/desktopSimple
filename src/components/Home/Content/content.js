import React from 'react';
import PropTypes from 'prop-types';

import './content.css';
import LoginForm from '../../../containers/Home/Login/login';

const Content = ({ loginForm }) => (
  <div id="content">
    <h1>Content</h1>
  </div>
);

Content.propTypes = {
  loginForm: PropTypes.object.isRequired,
};

export default Content;
