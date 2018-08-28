import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './userLoader.css';
import Loader from '../../Modules/Loader';
import { fetchUsersAction } from '../../store/reducers/userReducer';

const mapStateToProps = ({ projectReducer, userReducer }) => ({
  project: projectReducer.activeProjectProcess.project,
  userList: userReducer.userList,
});

// Actions
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
  componentDidMount() {
    const { fetchUsers, filter } = this.props;
    fetchUsers(filter);
  }
  componentWillUnmount() {
    this.props.closeFromParent();
  }
  handlePagination = evt => {
    const { filter, fetchUsers } = this.props;
    const { pagination } = evt.target.dataset;
    fetchUsers(`${filter}${pagination}`);
  };
  render() {
    // filter and select from parent
    const { userList, select, filter } = this.props;
    const { loading, error, users, pagination } = userList;
    if (loading) {
      return <Loader />;
    }
    return (
      <div className="users">
        {error && <span>Error</span>}
        {pagination && (
          <div className="users-pagination">
            {pagination.prevPage && (
              <button
                className="btn btn-primary"
                key="prev"
                type="button"
                onClick={this.handlePagination}
                data-pagination={pagination.prevPage}
              >
                prev
              </button>
            )}
            {pagination.nextPage && (
              <button
                className="btn btn-primary"
                key="next"
                type="button"
                onClick={this.handlePagination}
                data-pagination={pagination.nextPage}
              >
                next
              </button>
            )}
          </div>
        )}
        <ul className="ul-unstyled users-list">
          {users.map(user => (
            <li key={user._id} className="users-list-item">
              <div className="thumbnail-container">
                <button
                  className="btn btn-primary"
                  data-user={JSON.stringify({
                    spec: filter.filter,
                    user: {
                      picture: user.picture,
                      fullName: user.fullName,
                      _id: user._id,
                    },
                  })}
                  onClick={select}
                >
                  Select
                </button>
                <div className="thumbnail-content">
                  <img
                    className="thumbnail"
                    src={user.picture}
                    alt={user.fullName}
                  />
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
