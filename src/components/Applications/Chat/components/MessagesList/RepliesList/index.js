import React, { Fragment } from 'react';
import Reply from './Reply';

class RepliesList extends React.Component {
  render() {
    const { replies, socket, room, loggedUser, callback } = this.props;
    return (
      <Fragment>
        {replies.map(reply => (
          <Reply
            reply={reply}
            socket={socket}
            room={room}
            loggedUser={loggedUser}
            callback={callback}
          />
        ))}
      </Fragment>
    );
  }
}

RepliesList.propTypes = {};

export default RepliesList;
