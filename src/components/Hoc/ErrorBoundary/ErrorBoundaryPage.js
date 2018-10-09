import React from 'react';
import PropTypes from 'prop-types';

const ErrorBoundaryPage = ({ message }) => {
  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <h1
          style={{
            fontSize: '3rem',
          }}
        >
          Our bad, Something went wrong
        </h1>
        <p>
          You should just refresh the page (f5, ctrl+r or your browser refresh
          button) or by clicking the following button
        </p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
        <p>{message}</p>
        <p>Sorry for the incoveniance</p>
        <p>If it happens again please leave us a message</p>
      </div>
    </div>
  );
};

ErrorBoundaryPage.propTypes = {
  message: PropTypes.string,
};

ErrorBoundaryPage.defaultProps = {
  message: '',
};

export default ErrorBoundaryPage;
