import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './userLoader.css';
import { fetchUsersAction } from '../../store/reducers/userReducer';
import Pagination from '../../components/Applications/AddressBook/components/Pagination';
import UserIconContainer from '../UserIcon';
import Button from '../../components/Form/button';

const mapStateToProps = ({ projectReducer, userReducer }) => ({
  project: projectReducer.activeProjectProcess.project,
  userList: userReducer.userList,
});

const mapDispatchToProps = dispatch => ({
  fetchUsers: filter => {
    dispatch(fetchUsersAction(filter));
  },
});

class UsersLoader extends React.Component {
  static propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    userList: PropTypes.shape({
      users: PropTypes.array || [],
      error: PropTypes.object,
      loading: PropTypes.bool,
    }).isRequired,
    filter: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    closeFromParent: PropTypes.func.isRequired,
  };
  state = {
    filter: {
      ...this.props.filter,
      available: true,
      tags: true,
      filter: '',
    },
  };
  componentDidMount() {
    const { fetchUsers } = this.props;
    const { filter } = this.state;
    fetchUsers({ ...filter });
  }
  componentWillUnmount() {
    this.props.closeFromParent();
  }
  handleFetchPage = evt => {
    const { fetchUsers } = this.props;
    const { filter } = this.state;
    const { page } = evt.target.dataset;
    fetchUsers({ page, ...filter });
  };
  handleInputChange = evt => {
    const { value } = evt.target;
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        filter: value,
      },
    }));
  };
  handleSearchUser = evt => {
    const { fetchUsers } = this.props;
    const { filter } = this.state;
    evt.preventDefault();
    fetchUsers({ ...filter });
  };
  render() {
    const { userList, select } = this.props;
    const { error, users } = userList;
    const { filter } = this.state;
    return (
      <div className="users">
        {error && <span>Error</span>}
        <div className="d-flex flex-justify-between flex-align-items-center">
          <form onSubmit={this.handleSearchUser}>
            <input
              value={filter.filter}
              onChange={this.handleInputChange}
              placeholder="Search..."
            />
            <Button
              type="submit"
              label="search"
              small
              style={{
                margin: 0,
              }}
            />
          </form>
          <Pagination
            prevPage={userList.pagination.prevPage}
            nextPage={userList.pagination.nextPage}
            loading={userList.loading}
            action={this.handleFetchPage}
            count={userList.pagination.count}
          />
        </div>

        <ul className="ul-unstyled users-list">
          {users.map(user => (
            <li key={user._id} className="users-list-item">
              <div className="thumbnail-container">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    select({
                      spec: filter.filter,
                      user: {
                        picture: user.picture,
                        fullName: user.fullName,
                        _id: user._id,
                      },
                    });
                  }}
                >
                  Select
                </button>
                <div className="thumbnail-content">
                  <UserIconContainer user={{ user }} classCss="big" />
                  <div className="user-detail">
                    <span className="user-detail-fullname">
                      {user.fullName}
                    </span>
                    <ul className="tag-list">
                      {user.tags.map((tag, index) => (
                        <li key={index} className="tag-list-item">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const UsersLoaderContainer = createContainer(UsersLoader);

export default UsersLoaderContainer;
