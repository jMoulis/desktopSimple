import React from 'react';
import PropTypes from 'prop-types';

const Filters = ({ filters }) => (
  <ul className="d-flex">
    {filters && filters.map(filter => <li>{filter.label}</li>)}
  </ul>
);

Filters.propTypes = {
  filters: PropTypes.array,
};

Filters.defaultProps = {
  filters: null,
};

export default Filters;
