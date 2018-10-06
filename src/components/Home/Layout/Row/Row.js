import React from 'react';
import PropTypes from 'prop-types';
import './row.css';

const Row = ({ children, styleProps }) => {
  return (
    <section className="row" style={styleProps}>
      {children}
    </section>
  );
};

Row.propTypes = {};

export default Row;
