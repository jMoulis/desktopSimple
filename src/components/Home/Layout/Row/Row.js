import React from 'react';
import PropTypes from 'prop-types';
import './row.css';

const Row = ({ children, styleProps, ...props }) => (
  <section className="row" style={styleProps} {...props}>
    {children}
  </section>
);

Row.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default Row;
