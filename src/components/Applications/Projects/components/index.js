import React from 'react';
import PropTypes from 'prop-types';
import './project.css';
import ListProject from '../containers/ListProject';
import NewProject from '../containers/NewProject/newProject';

class Projects extends React.Component {
  static propTypes = {
    fetchProjectsAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    globalProps: PropTypes.object.isRequired,
  }
  state = {
    tab: 'projects',
  }
  componentDidMount() {
    const { fetchProjectsAction } = this.props;
    fetchProjectsAction();
  }
  handleTabSelect = (evt) => {
    const { dataset } = evt.currentTarget;
    let dataSetToState = {};
    Object.keys(dataset).map((key) => {
      dataSetToState = { ...dataSetToState, [key]: dataset[key] };
      return dataSetToState;
    });
    this.setState(() => ({
      ...dataSetToState,
    }));
  }
  render() {
    const { globalActions, globalProps, loggedUser } = this.props;
    return (
      <div className="project-container">
        <div className="app-toolbar" key="app-toolbar">
          <ul>
            <li>
              <button
                className="btn-app-toolbar unselectable"
                name="projects"
                data-tab="projects"
                onClick={this.handleTabSelect}
              >
              Projects
              </button>
            </li>
            <li>
              <button
                className="btn-app-toolbar unselectable"
                name="create-project"
                data-tab="create-project"
                onClick={this.handleTabSelect}
              >
              New Project
              </button>
            </li>
          </ul>
        </div>
        {this.state.tab === 'projects' &&
          <ListProject
            selectTab={this.handleTabSelect}
            loggedUser={loggedUser}
            globalActions={globalActions}
            globalProps={globalProps}
          />
        }
        {this.state.tab === 'create-project' &&
          <NewProject
            loggedUser={loggedUser}
          />
        }
      </div>
    );
  }
}

export default Projects;
