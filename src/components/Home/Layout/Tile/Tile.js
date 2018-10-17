import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Tile = ({ title, icon, children }) => (
  <article className="tile">
    <i className={`${icon} fa-7x`} />
    <h3 className="tile-title">{title}</h3>
    <div className="tile-text">{children}</div>
  </article>
);

Tile.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.any,
  ]).isRequired,
};

export default Tile;
