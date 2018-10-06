import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Tile = ({ title, icon, children }) => {
  return (
    <article className="tile">
      <i className={`${icon} fa-7x`} />
      <h3 className="tile-title">{title}</h3>
      <div className="tile-text">{children}</div>
    </article>
  );
};

Tile.propTypes = {};

export default Tile;
