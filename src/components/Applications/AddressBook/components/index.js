import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import AppToolbar from '../../../../Modules/AppToolbar';
import UserListItem from '../containers/Users/UserListItem';
import Pagination from './Pagination';
import './index.css';

class AddressBook extends Component {
  static propTypes = {
    fetchUsersAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
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
    const { usersProcess, fetchUsersAction, loggedUser } = this.props;
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
          <div className="address-book d-flex full-height">
            <ul className="address-book-aside">
              <li>
                <button className="address-book-aside-btn" type="button">
                  My Contacts
                </button>
              </li>
              <li>
                <button className="address-book-aside-btn" type="button">
                  Pending request
                </button>
              </li>
            </ul>
            <ul className="overflow height-overflow flex1">
              <li>
                <Pagination
                  prevPage={usersProcess.pagination.prevPage}
                  nextPage={usersProcess.pagination.nextPage}
                  loading={usersProcess.loading}
                  action={this.handleFetchPage}
                  count={usersProcess.pagination.count}
                />
              </li>
              {usersProcess.users.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  loggedUser={loggedUser}
                />
              ))}
            </ul>
          </div>
        </Fragment>
      );
    }
    return <div />;
  }
}

export default AddressBook;
