import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.css';

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reduced: props.reduceOnMount,
    };
  }

  handleReduced = () => {
    this.setState(prevState => ({
      reduced: !prevState.reduced,
    }));
  };

  render() {
    const { children } = this.props;
    const { reduced } = this.state;
    return (
      <div className={`wrapper ${reduced ? 'wrapper-reduced' : ''}`}>
        <header
          className="wrapper-header"
          onClick={this.handleReduced}
          onKeyDown={this.handleReduced}
        >
          Information
        </header>
        {!reduced && children}
      </div>
    );
  }
}

Wrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default Wrapper;
