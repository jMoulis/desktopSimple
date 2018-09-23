import React from 'react';
import PropTypes from 'prop-types';
// import { ROOT_URL } from '../../../Utils/config';

import './footerThumbnail.css';

const ROOT_URL = process.env.REACT_APP_API;
const FooterThumbnail = ({ user }) => (
  <div id="footer-thumbnail-container">
    <img
      src={user.picture ? `${ROOT_URL}${user.picture}` : '/img/avatar.png'}
      alt="thumbnail"
      title={user.fullName}
    />
  </div>
);

FooterThumbnail.propTypes = {
  user: PropTypes.object.isRequired,
};

export default FooterThumbnail;
