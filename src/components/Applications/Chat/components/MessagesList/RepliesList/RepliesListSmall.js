import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RepliesListSmall extends Component {
  render() {
    const { replies, callback } = this.props;
    return (
      <div
        style={{
          marginLeft: '.5rem',
          fontSize: '.7rem',
        }}
      >
        {replies.length && replies.length > 0 ? (
          <button onClick={callback}>{replies.length} replies</button>
        ) : (
          ''
        )}
      </div>
    );
  }
}

RepliesListSmall.propTypes = {};

export default RepliesListSmall;
