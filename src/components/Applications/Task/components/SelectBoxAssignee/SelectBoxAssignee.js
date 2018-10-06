import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './index.css';
// import { ROOT_URL } from '../../../../../Utils/config';
import UserIconContainer from '../../../../../Modules/UserIcon';

const ROOT_URL = process.env.REACT_APP_API;

class SelectBoxAssignee extends Component {
  static propTypes = {
    teamId: PropTypes.string,
    callback: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    teamId: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      showList: false,
    };
  }
  componentDidMount() {
    const { teamId } = this.props;
    if (teamId) return this.fetchTeam(teamId);
    return true;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.teamId !== this.props.teamId) {
      return this.fetchTeam(this.props.teamId);
    }
    return true;
  }
  fetchTeam = async teamId => {
    try {
      if (teamId) {
        const {
          data: { team },
        } = await axios({
          method: 'get',
          url: `${ROOT_URL}/api/teams/${teamId}`,
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        this.setState(() => ({
          users: team.users || null,
          showList: false,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleShowList = () => {
    this.setState(prevState => ({
      showList: !prevState.showList,
    }));
  };

  handleSelect = user => {
    this.setState(() => ({
      showList: false,
      user,
    }));
  };

  render() {
    const { users, showList, user } = this.state;
    const { callback, disabled } = this.props;
    return (
      <div className="selectbox-assign relative">
        <button
          className="selectbox-assign-btn"
          disabled={!disabled}
          onClick={this.handleShowList}
          title={!disabled ? 'Select a team first' : 'Select a assignee'}
        >
          {this.state.user ? (
            <UserIconContainer
              active={false}
              user={{
                user: {
                  _id: user._id,
                  picture: user.picture,
                  fullName: user.fullName,
                },
              }}
              name
            />
          ) : (
            'Select Assign'
          )}
        </button>
        {showList && (
          <ul className="selectbox-assign-list absolute">
            <li className="selectbox-assign-list-item">
              <UserIconContainer
                active={false}
                callback={evt => {
                  callback(evt);
                  this.handleSelect();
                }}
                user={{
                  user: {
                    fullName: 'Select User',
                    picture: '/public/img/anonymous.png',
                  },
                }}
                name
              />
            </li>
            {users &&
              users.map(({ user }) => {
                if (user)
                  return (
                    <li className="selectbox-assign-list-item" key={user._id}>
                      <UserIconContainer
                        callback={evt => {
                          callback(evt);
                          this.handleSelect(user);
                        }}
                        active={false}
                        user={{
                          user: {
                            _id: user._id,
                            picture: user.picture,
                            fullName: user.fullName,
                          },
                        }}
                        name
                      />
                    </li>
                  );
              })}
          </ul>
        )}
      </div>
    );
  }
}

export default SelectBoxAssignee;
