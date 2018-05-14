import React from 'react';
import PropTypes from 'prop-types';
import './thumbnail.css';

const Thumbnail = ({ user }) => (
  <div className="thumbnail-container">
    <img className="thumbnail" src={user.picture || '/img/avatar.png'} alt={user.fullName} />
    <span>{user.fullName}</span>
  </div>
);

Thumbnail.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Thumbnail;
