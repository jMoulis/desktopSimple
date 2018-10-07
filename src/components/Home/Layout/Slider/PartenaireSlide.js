import React from 'react';
import PropTypes from 'prop-types';

const PartenaireSlide = ({ item }) => {
  return (
    <li className="slider-list-item">
      <img
        style={{
          width: '220px',
          borderRadius: '10%',
        }}
        src={item.picture}
        alt="Company"
      />
    </li>
  );
};

PartenaireSlide.propTypes = {};

export default PartenaireSlide;
