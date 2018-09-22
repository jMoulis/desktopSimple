import React from 'react';
import PropTypes from 'prop-types';

const Filters = ({ filters }) => (
  <div>
    <span>Key words:</span>
    <ul className="d-flex">
      {filters && filters.map(filter => <li>{filter.label}</li>)}
    </ul>
  </div>
);

Filters.propTypes = {
  filters: PropTypes.array,
};

Filters.defaultProps = {
  filters: null,
};

export default Filters;
