import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default ChildComponent => {
  class ComposedComponent extends Component {
    static propTypes = {
      auth: PropTypes.string,
      urlRedirect: PropTypes.string,
      history: PropTypes.object.isRequired,
    };
    static defaultProps = {
      auth: null,
      urlRedirect: null,
    };
    componentDidMount() {
      this.shouldNavigateAway();
    }
    componentDidUpdate() {
      this.shouldNavigateAway();
    }
    shouldNavigateAway() {
      const { history, urlRedirect } = this.props;
      const token = localStorage.getItem('token');
      // if (!auth) {
      //   history.push(`${urlRedirect || '/'}`);
      // }
    }
    render() {
      return <ChildComponent {...this.props} />;
    }
  }
  function mapStateToProps({ authReducer }) {
    return {
      auth: authReducer.authenticated,
      urlRedirect: authReducer.urlRedirect,
    };
  }
  return connect(mapStateToProps)(ComposedComponent);
};
