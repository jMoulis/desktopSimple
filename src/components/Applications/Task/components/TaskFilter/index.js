import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class TaskFilter extends React.Component {
  state = {
    selectedTab: 'All',
  };

  handleClick = evt => {
    const { filter } = evt.currentTarget.dataset;
    const { fetchTasksAction } = this.props;
    const { id } = evt.target;
    fetchTasksAction(JSON.parse(filter));
    this.setState(() => ({
      selectedTab: id,
    }));
  };

  render() {
    const { selectedTab } = this.state;
    return (
      <ul className="left-navbar">
        <li
          className={`task-list-item ${
            selectedTab === 'All' ? 'task-list-item-selected' : ''
          }`}
        >
          <button
            onClick={this.handleClick}
            data-filter={JSON.stringify(
              { repository: { filter: '' } },
              {
                filterName: {
                  label: 'All',
                  type: 'main',
                },
              },
            )}
            className="left-navbar-btn"
            type="button"
            id="All"
          >
            All Tasks
          </button>
        </li>
        <li
          className={`task-list-item ${
            selectedTab === 'My Tasks' ? 'task-list-item-selected' : ''
          }`}
        >
          <button
            onClick={this.handleClick}
            data-filter={JSON.stringify(
              { repository: { myTask: true } },
              {
                filterName: {
                  label: 'My Tasks',
                  type: 'main',
                },
              },
            )}
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

TaskFilter.propTypes = {
  fetchTasksAction: PropTypes.func.isRequired,
};

export default TaskFilter;
