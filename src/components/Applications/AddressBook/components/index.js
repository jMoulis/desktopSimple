import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import AppToolbar from '../../../../Modules/AppToolbar';
import UserListItem from '../containers/Users/UserListItem';
import Pagination from './Pagination';
import LeftNavBar from './LeftNavBar';
import './index.css';

class AddressBook extends Component {
  static propTypes = {
    fetchUsersAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    globalProps: PropTypes.object.isRequired,
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
          repository:
            filterName.type === 'main' ? { ...filter.repository } : '',
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
        this.setState(prevState => ({
          filterParams: {
            ...prevState.filterParams,
            filter: '',
          },
        }));
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
    const { usersProcess, globalProps } = this.props;
    if (usersProcess.users) {
      return (
        <Fragment>
          <AppToolbar
            sortingAction={this.handleAppToolBarSearch}
            search={{
              show: true,
              searchField: true,
              action: this.handleAppToolBarSearch,
              searchFieldLabel: 'Contains text',
            }}
          />

          <div className="address-book d-flex full-height">
            <LeftNavBar fetchUsersAction={this.handleFetchUsers} />
            <ul className="overflow height-overflow flex1">
              <li
                className="d-flex flex-align-items-center flex-justify-between address-book-pagination"
                style={{
                  margin: '.5rem',
                }}
              >
                <span>Search in: {this.state.repertory}</span>
                <Pagination
                  prevPage={usersProcess.pagination.prevPage}
                  nextPage={usersProcess.pagination.nextPage}
                  loading={usersProcess.loading}
                  action={this.handleFetchPage}
                  count={usersProcess.pagination.count}
                />
              </li>
              {usersProcess.error ? (
                <div className="not-found">
                  <span>{usersProcess.error.detail}</span>
                </div>
              ) : (
                usersProcess.users.map(user => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    loggedUser={globalProps.loggedUser}
                    socket={globalProps.socketIo}
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
