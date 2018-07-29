import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserIconContainer from '../UserIcon';
import './index.css';

const mapStateToProps = ({ mainTeamReducer }) => ({
  userList: mainTeamReducer.activeTeamProcess.team.users,
});

class SelectBoxUser extends Component {
  static propTypes = {
    userList: PropTypes.array.isRequired,
    callback: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
    };
  }
  handleShowList = () => {
    this.setState(prevState => ({
      ...prevState,
      showList: !prevState.showList,
    }));
  };

  render() {
    const { userList, callback } = this.props;
    const { showList } = this.state;
    return (
      <div>
        <div id="selectbox-user">
          Fake Input{' '}
          <button type="button" onClick={this.handleShowList}>
            ->
          </button>
          {showList && (
            <ul className="selectbox-user-list">
              {userList.map(user => (
                <li
                  className="d-flex flex-align-items-center pointer"
                  onClick={() => {
                    callback(user._id);
                    this.handleShowList();
                  }}
                  onKeyPress={() => {
                    callback(user._id);
                    this.handleShowList();
                  }}
                >
                  <UserIconContainer user={user} />
                  <span>{user.user.fullName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

const createContainer = connect(
  mapStateToProps,
  null,
);
const SelectBoxUserContainer = createContainer(SelectBoxUser);

export default SelectBoxUserContainer;
