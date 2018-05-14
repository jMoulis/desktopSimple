import React from 'react';
import PropTypes from 'prop-types';
import './footerThumbnail.css';

const FooterThumbnail = ({ picture }) => (
  <div id="footer-thumbnail-container">
    <img src={picture} alt="thumbnail" />
  </div>
);

FooterThumbnail.propTypes = {
  picture: PropTypes.string,
};

FooterThumbnail.defaultProps = {
  picture: '/img/avatar.png',
};

export default FooterThumbnail;