import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import AppToolbar from '../../../../Modules/AppToolbar';

class AddressBook extends Component {
  componentDidMount() {
    const { fetchUsersAction } = this.props;
    fetchUsersAction('');
  }
  render() {
    const { users, fetchUsersAction } = this.props;
    if (users) {
      return (
        <Fragment>
          <AppToolbar
            sortingAction={fetchUsersAction}
            menus={[
              {
                label: 'test',
                action: () => console.log('test'),
              },
              {
                label: 'test2',
                action: () => console.log('test2'),
              },
            ]}
          />
          <ul>{users.map(user => <li key={user._id}>{user.fullName}</li>)}</ul>
        </Fragment>
      );
    }
    return <div />;
  }
}

AddressBook.propTypes = {};

export default AddressBook;
