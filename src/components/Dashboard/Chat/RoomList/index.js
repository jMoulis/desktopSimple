import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Wrapper from '../Wrapper';
import UserIconContainer from '../../../../Modules/UserIcon';
import './index.css';

const ROOT_URL = process.env.REACT_APP_API;

class RoomList extends React.Component {
  state = {
    rooms: [],
  };

  componentDidMount() {
    const { loggedUser } = this.props;
    this.fetchRoomsAction(loggedUser);
  }

  fetchRoomsAction = async user => {
    const {
      data: { rooms },
    } = await axios({
      method: 'get',
      url: `${ROOT_URL}/api/rooms?sender=${user._id}`,
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    });
    this.setState(() => ({
      rooms,
    }));
  };

  render() {
    const { loggedUser, callback } = this.props;
    const { rooms } = this.state;
    return (
      <Wrapper reduceOnMount>
        <div className={`conversation-list`}>
          {rooms &&
            rooms.map(room => (
              <Fragment key={room._id}>
                {room.users.map(user => {
                  if (user._id !== loggedUser._id)
                    return (
                      <UserIconContainer
                        key={user._id}
                        user={{ user }}
                        name
                        callback={() => callback(user)}
                        active={false}
                      />
                    );
                })}
              </Fragment>
            ))}
        </div>
      </Wrapper>
    );
  }
}

RoomList.propTypes = {
  loggedUser: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
};

export default RoomList;
