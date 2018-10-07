import React from 'react';
import PropTypes from 'prop-types';
import './row.css';

const Row = ({ children, styleProps, ...props }) => {
  return (
    <section className="row" style={styleProps} {...props}>
      {children}
    </section>
  );
};

Row.propTypes = {};

export default Row;
