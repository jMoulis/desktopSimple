import React from 'react';
import PropTypes from 'prop-types';
import successIcon from './success.svg';

class SuccessIcon extends React.Component {
  state = {
    displayIcon: false,
  };

  componentDidMount() {
    this.loadIcon();
  }

  componentDidUpdate() {
    if (this.state.displayIcon) {
      setTimeout(() => this.setState(() => ({ displayIcon: false })), 1500);
    }
  }

  loadIcon = () => {
    this.setState(() => ({
      displayIcon: true,
    }));
  };

  render() {
    const { style } = this.props;
    const { displayIcon } = this.state;
    if (displayIcon) {
      return <img style={style} src={successIcon} alt="Success Icon" />;
    }
    return (
      <span
        style={{
          display: 'none',
        }}
      />
    );
  }
}

SuccessIcon.propTypes = {
  style: PropTypes.object,
};

SuccessIcon.defaultProps = {
  style: {
    position: 'absolute',
    right: '15px',
    top: '30px',
  },
};

export default SuccessIcon;
