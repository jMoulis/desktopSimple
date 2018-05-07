import React from 'react';
import PropTypes from 'prop-types';

class UsersLoader extends React.Component {
  static propTypes = {
    fetchUsersAction: PropTypes.func.isRequired,
    userList: PropTypes.shape({
      users: PropTypes.array || [],
      error: PropTypes.object,
      loading: PropTypes.bool,
    }).isRequired,
  }
  componentDidMount() {
    const { fetchUsersAction, filter } = this.props;
    fetchUsersAction(filter);
  }
  handlePagination = (evt) => {
    const { filter, fetchUsersAction } = this.props;
    const { pagination } = evt.target.dataset;

    fetchUsersAction(`${filter}${pagination}`);
  }
  render() {
    const { userList } = this.props;
    const {
      loading,
      error,
      users,
      pagination
    } = userList;
    if (loading) {
      return <span>Loading</span>;
    }
    return (
      <div>Users
        <ul className="ul-unstyled">
          {users.map(user => (
            <li key={user._id} className="users-list-item">
              <div className="thumbnail-container">
                <img className="thumbnail" src={user.picture} alt={user.fullName} />
                <span>{user.fullName}</span>
              </div>
            </li>
            ))}
        </ul>
        {pagination &&
          <div>
            {pagination.prev &&
              <button
                key="prev"
                type="button"
                onClick={this.handlePagination}
                data-pagination={pagination.prev}
              >prev
              </button>
            }
            {pagination.next &&
              <button
                key="next"
                type="button"
                onClick={this.handlePagination}
                data-pagination={pagination.next}
              >next
              </button>
            }
          </div>}
      </div>
    );
  }
}

export default UsersLoader;
