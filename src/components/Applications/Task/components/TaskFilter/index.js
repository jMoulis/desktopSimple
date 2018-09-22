import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class TaskFilter extends React.Component {
  static propTypes = {
    fetchTasksAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };
  state = {
    selectedTab: 'All',
  };

  handleClick = (filter, id) => {
    const { fetchTasksAction } = this.props;
    fetchTasksAction(filter);
    this.setState(() => ({
      selectedTab: id,
    }));
  };

  render() {
    const { selectedTab } = this.state;
    const { loggedUser } = this.props;
    return (
      <ul className="left-navbar">
        <li
          className={`task-list-item ${
            selectedTab === 'All' ? 'task-list-item-selected' : ''
          }`}
        >
          <button
            onClick={() => this.handleClick({}, 'All')}
            data-filter=""
            className="left-navbar-btn"
            type="button"
            id="All"
          >
            All Tasks
          </button>
        </li>
        {loggedUser.teams.map(team => (
          <li
            key={team._id}
            className={`task-list-item ${
              selectedTab === team.name ? 'task-list-item-selected' : ''
            }`}
          >
            <button
              onClick={() => {
                this.handleClick({ team: team._id }, team.name);
              }}
              className="left-navbar-btn"
              type="button"
              id={team.name}
            >
              {team.name}
            </button>
          </li>
        ))}
        <li
          className={`task-list-item ${
            selectedTab === 'My Tasks' ? 'task-list-item-selected' : ''
          }`}
        >
          <button
            onClick={() => this.handleClick({ myTask: true }, 'My Tasks')}
            className="left-navbar-btn"
            type="button"
            id="My Tasks"
          >
            My Tasks
          </button>
        </li>
      </ul>
    );
  }
}

export default TaskFilter;
