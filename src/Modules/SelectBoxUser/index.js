import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserIconContainer from '../UserIcon';
import './index.css';
import Button from '../../components/Form/button';

const mapStateToProps = ({ mainTeamReducer, authReducer }) => ({
  userList: mainTeamReducer.activeTeamProcess.team.users,
  loggedUser: authReducer.loginProcess.loggedUser,
});

class SelectBoxUser extends React.Component {
  constructor(props) {
    super(props);
    const { loggedUser, userList } = props;
    let users = [];
    if (!props.userList) {
      users = [
        ...users,
        {
          user: {
            _id: loggedUser._id,
            fullName: loggedUser.fullName,
            picture: loggedUser.picture,
          },
        },
      ];
    }
    this.state = {
      userList: userList || users,
    };
  }
  render() {
    const { callback, closeFromParent } = this.props;
    const { userList } = this.state;
    return (
      <div>
        {userList && (
          <div id="selectbox-user">
            <ul className="selectbox-user-list">
              {userList.map(({ user }) => (
                <li
                  key={user._id}
                  className="d-flex flex-align-items-center pointer"
                >
                  <Button
                    label="Select"
                    onClick={() => {
                      callback(user);
                      closeFromParent();
                    }}
                  />
                  <UserIconContainer user={{ user }} />
                  <span>{user.fullName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

SelectBoxUser.propTypes = {
  userList: PropTypes.array,
  callback: PropTypes.func.isRequired,
  closeFromParent: PropTypes.func.isRequired,
};
SelectBoxUser.defaultProps = {
  userList: null,
};
const createContainer = connect(
  mapStateToProps,
  null,
);
const SelectBoxUserContainer = createContainer(SelectBoxUser);

export default SelectBoxUserContainer;
