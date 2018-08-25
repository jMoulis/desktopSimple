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

  state = {
    filter: '',
  };

  componentDidMount() {
    const { fetchUsersAction } = this.props;
    const filter = {
      filter: '',
    };
    fetchUsersAction(filter);
  }
  render() {
    const { usersProcess, fetchUsersAction } = this.props;

    if (usersProcess.users) {
      return (
        <Fragment>
          <AppToolbar
            sortingAction={fetchUsersAction}
            menus={[
              {
                label: 'Student',
                action: () => {
                  fetchUsersAction({ type: 'student' });
                },
              },
              {
                label: 'Company',
                action: () => {
                  fetchUsersAction({ type: 'company' });
                },
              },
              {
                label: 'All',
                action: () => {
                  fetchUsersAction({});
                },
              },
              {
                search: true,
                action: fetchUsersAction,
              },
            ]}
          />
          {usersProcess.error && (
            <div className="notFound">
              <span>{usersProcess.error.detail}</span>
            </div>
          )}
          <ul className="d-flex flex-wrap overflow height-overflow">
            {usersProcess.users.map(user => (
              <UserListItem key={user._id} user={user} />
            ))}
          </ul>
        </Fragment>
      );
    }
    return <div />;
  }
}

export default AddressBook;
