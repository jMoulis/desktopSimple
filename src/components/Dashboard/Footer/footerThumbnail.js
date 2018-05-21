import React from 'react';
import PropTypes from 'prop-types';
import './footerThumbnail.css';

const FooterThumbnail = ({ user }) => (
  <div id="footer-thumbnail-container">
    <img src={user.picture || '/img/avatar.png'} alt="thumbnail" title={user.fullName} />
  </div>
);

FooterThumbnail.propTypes = {
  user: PropTypes.object.isRequired,
};

export default FooterThumbnail;
