import React from 'react';
import PropTypes from 'prop-types';
import Tag from './tagItem';

const propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const TagList = ({ tags }) => (
  <ul className="tags">
    {tags.map((tag, index) => (
      <li key={index} className="tags-item">
        <Tag tag={tag} />
      </li>
    ))}
  </ul>
);

TagList.propTypes = propTypes;

export default TagList;
