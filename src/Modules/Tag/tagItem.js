import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const propTypes = {
  tag: PropTypes.string.isRequired,
};

const Tag = ({ tag, ...rest }) => (
  <span className="tag" {...rest} title={tag}>
    {tag}
  </span>
);

Tag.propTypes = propTypes;

export default Tag;
