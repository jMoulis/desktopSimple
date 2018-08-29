import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Pagination = ({ prevPage, nextPage, loading, action, count }) => (
  <div className="pagination d-flex">
    <span>Results: {count}</span>
    <button
      type="button"
      className="pagination-btn"
      data-page={prevPage}
      disabled={!prevPage || loading}
      onClick={action}
    >
      Previous
    </button>

    <button
      type="button"
      className="pagination-btn"
      data-page={nextPage}
      disabled={!nextPage || loading}
      onClick={action}
    >
      Next
    </button>
  </div>
);

Pagination.propTypes = {
  prevPage: PropTypes.number,
  nextPage: PropTypes.number,
  count: PropTypes.number,
  loading: PropTypes.bool,
  action: PropTypes.func,
};

Pagination.defaultProps = {
  prevPage: null,
  nextPage: null,
  loading: false,
  action: null,
  count: 0,
};
export default Pagination;
