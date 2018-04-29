import React from 'react';
import PropTypes from 'prop-types';
import './thumbnail.css';

const Thumbnail = ({ picture }) => (
  <div id="thumbnail-container">
    <img src={picture} alt="thumbnail" />
  </div>
);

Thumbnail.propTypes = {
  picture: PropTypes.string.isRequired,
};

export default Thumbnail;
