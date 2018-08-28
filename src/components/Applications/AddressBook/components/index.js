import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import AppToolbar from '../../../../Modules/AppToolbar';
import UserListItem from './Users/UserListItem';

class AddressBook extends Component {
  static propTypes = {
    fetchUsersAction: PropTypes.func.isRequired,
    usersProcess: PropTypes.object,
  };

  static defaultProps = {
    usersProcess: null,
  };

  componentDidMount() {
    const { fetchUsersAction } = this.props;
    const filter = {
      filter: '',
    };
    fetchUsersAction(filter);
  }
  handleFetchPage = evt => {
    const { fetchUsersAction } = this.props;
    const { page } = evt.target.dataset;
    fetchUsersAction({ page });
  };
  render() {
    const { usersProcess, fetchUsersAction } = this.props;
    if (usersProcess.users) {
      return (
        <Fragment>
          <AppToolbar
            sortingAction={fetchUsersAction}
            menus={[
              // {
              //   label: 'Student',
              //   filterValue: { type: 'student' },
              //   action: fetchUsersAction,
              // },
              // {
              //   label: 'Company',
              //   filterValue: { type: 'company' },
              //   action: fetchUsersAction,
              // },
              // {
              //   label: 'All',
              //   filterValue: { type: '' },
              //   action: fetchUsersAction,
              // },
              {
                searchField: true,
                action: fetchUsersAction,
                searchFieldLabel: 'Spec, name, location, company...',
              },
            ]}
          />

          {usersProcess.error && (
            <div className="notFound">
              <span>{usersProcess.error.detail}</span>
            </div>
          )}
          <div className="d-flex full-height">
            <ul>
              <li>
                <button type="button">My Contacts</button>
              </li>
              {/* <li>
                Filter
                <ul>
                  <li>
                    <select>
                      <option>All</option>
                      <option>Student</option>
                      <option>Company</option>
                    </select>
                    <div className="d-flex flex-column">
                      <button type="button">Filter</button>
                      <button type="button">Reset</button>
                    </div>
                  </li>
                </ul>
              </li> */}
            </ul>
            <ul className="overflow height-overflow flex1">
              {usersProcess.users.map(user => (
                <UserListItem key={user._id} user={user} />
              ))}
              <li>
                <div>
                  <button
                    type="button"
                    data-page={usersProcess.pagination.prevPage}
                    disabled={
                      !usersProcess.pagination.prevPage || usersProcess.loading
                    }
                    onClick={this.handleFetchPage}
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    data-page={usersProcess.pagination.nextPage}
                    disabled={
                      !usersProcess.pagination.nextPage || usersProcess.loading
                    }
                    onClick={this.handleFetchPage}
                  >
                    Next
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </Fragment>
      );
    }
    return <div />;
  }
}

export default AddressBook;
