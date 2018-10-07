import React from 'react';
import PropTypes from 'prop-types';

const TestimonySlide = ({ item }) => {
  return (
    <li className="d-flex flex-column slider-list-item">
      <header
        style={{
          padding: '.5rem 0',
        }}
        className="d-flex flex-align-items-center"
      >
        <img
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
          }}
          src={item.user.picture}
          alt="Temoignage"
        />
        <span>{item.user.name}</span>
      </header>
      <p>{item.message}</p>
    </li>
  );
};

TestimonySlide.propTypes = {};

export default TestimonySlide;
