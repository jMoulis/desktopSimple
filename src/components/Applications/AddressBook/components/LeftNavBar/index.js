import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const LeftNavBar = ({ fetchUsersAction }) => (
  <ul className="left-navbar">
    <li>
      <button
        onClick={() =>
          fetchUsersAction(
            { repository: {} },
            {
              filterName: {
                label: 'All',
                type: 'main',
              },
            },
          )
        }
        className="left-navbar-btn"
        type="button"
      >
        All Contacts
      </button>
    </li>
    <li>
      <button
        onClick={() =>
          fetchUsersAction(
            { repository: { friends: true } },
            {
              filterName: {
                label: 'My Contacts',
                type: 'main',
              },
            },
          )
        }
        className="left-navbar-btn"
        type="button"
      >
        My Contacts
      </button>
    </li>
    <li>
      <button
        onClick={() =>
          fetchUsersAction(
            { repository: { received: true } },
            {
              filterName: {
                label: 'Received Request',
                type: 'main',
              },
            },
          )
        }
        className="left-navbar-btn"
        type="button"
      >
        Received Request
      </button>
    </li>
    <li>
      <button
        onClick={() =>
          fetchUsersAction(
            { repository: { sent: true } },
            {
              filterName: {
                label: 'Sent Request',
                type: 'main',
              },
            },
          )
        }
        className="left-navbar-btn"
        type="button"
      >
        Sent Request
      </button>
    </li>
  </ul>
);

LeftNavBar.propTypes = {
  fetchUsersAction: PropTypes.func.isRequired,
};

export default LeftNavBar;
