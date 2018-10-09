import React from 'react';
import Axios from 'axios';
import ErrorBoundaryPage from './ErrorBoundaryPage';
import './index.css';

const ROOT_URL = process.env.REACT_APP_API;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  async componentDidCatch(error, info) {
    try {
      const { data } = await Axios({
        method: 'POST',
        url: `${ROOT_URL}/api/errors`,
        headers: {
          Authorization: localStorage.getItem('token'),
        },
        data: {
          error: {
            message: error.message,
            stack: info.componentStack,
          },
        },
      });
      this.setState(() => ({ hasError: true, message: data.message }));
    } catch (err) {
      this.setState(() => ({
        hasError: true,
        message: err.message,
      }));
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryPage message={this.state.message} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
