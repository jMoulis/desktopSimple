import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import AppToolbar from '../../../../Modules/AppToolbar';
import UserListItem from '../containers/Users/UserListItem';
import Pagination from './Pagination';
import './index.css';
import Filters from './Filters';

class AddressBook extends Component {
  static propTypes = {
    fetchUsersAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    usersProcess: PropTypes.object,
  };

  static defaultProps = {
    usersProcess: null,
  };

  state = {
    filterParams: {
      filter: '',
    },
    repertory: 'All',
    filters: [],
  };

  componentDidMount() {
    const { fetchUsersAction } = this.props;
    fetchUsersAction(this.state.filterParams);
  }

  handleFetchUsers = (filter, { filterName }) => {
    const { fetchUsersAction } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        filterParams: {
          ...prevState.filterParams,
          ...filter,
        },
        repertory: filterName.label,
        filters: this.addValueToStateFilters(prevState.filters, filterName),
      }),
      () => {
        fetchUsersAction(this.state.filterParams);
      },
    );
  };

  handleAppToolBarSearch = filter => {
    const { fetchUsersAction } = this.props;
    this.setState(
      prevState => ({
        ...prevState,
        filterParams: {
          ...prevState.filterParams,
          ...filter,
        },
        filters: this.addValueToStateFilters(prevState.filters, {
          label: Object.values(filter)[0],
          type: '',
        }),
      }),
      () => {
        fetchUsersAction(this.state.filterParams);
      },
    );
  };

  handleFetchPage = evt => {
    const { fetchUsersAction } = this.props;
    const { page } = evt.target.dataset;
    fetchUsersAction({ page });
  };

  addValueToStateFilters = (filters, filterName) => {
    if (filters.some(filter => filter.label === filterName.label)) {
      return filters;
    }
    if (filterName.type === 'main') {
      return [...filters.filter(filter => filter.type !== filterName.type)];
    }
    return [...filters, filterName];
  };

  render() {
    const { usersProcess, loggedUser } = this.props;
    const { filters } = this.state;
    if (usersProcess.users) {
      return (
        <Fragment>
          <AppToolbar
            sortingAction={this.handleAppToolBarSearch}
            menus={[
              // {
              //   label: 'Student',
              //   filterValue: { type: 'student' },
              //   action: fetchUsersAction,
              // },
              {
                searchField: true,
                action: this.handleAppToolBarSearch,
                searchFieldLabel: 'Spec, name, location, company...',
              },
            ]}
          />

          <div className="address-book d-flex full-height">
            <ul className="address-book-aside">
              <li>
                <button
                  onClick={() =>
                    this.handleFetchUsers(
                      { friends: '' },
                      {
                        filterName: {
                          label: 'All',
                          type: 'main',
                        },
                      },
                    )
                  }
                  className="address-book-aside-btn"
                  type="button"
                >
                  All Contacts
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    this.handleFetchUsers(
                      { friends: true },
                      {
                        filterName: {
                          label: 'My Contacts',
                          type: 'main',
                        },
                      },
                    )
                  }
                  className="address-book-aside-btn"
                  type="button"
                >
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
              <li
                className="d-flex flex-align-items-center flex-justify-between"
                style={{
                  margin: '.5rem',
                }}
              >
                <span>Search in: {this.state.repertory}</span>
                {/* <Filters filters={filters} /> */}
                <Pagination
                  prevPage={usersProcess.pagination.prevPage}
                  nextPage={usersProcess.pagination.nextPage}
                  loading={usersProcess.loading}
                  action={this.handleFetchPage}
                  count={usersProcess.pagination.count}
                />
              </li>
              {usersProcess.error ? (
                <div className="notFound">
                  <span>{usersProcess.error.detail}</span>
                </div>
              ) : (
                usersProcess.users.map(user => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    loggedUser={loggedUser}
                  />
                ))
              )}
            </ul>
          </div>
        </Fragment>
      );
    }
    return <div />;
  }
}

export default AddressBook;
