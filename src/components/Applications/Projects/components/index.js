import React from 'react';
import PropTypes from 'prop-types';
import './project.css';
import ListProject from '../containers/ListProject';
import Team from '../containers/Team';

class Projects extends React.Component {
  static propTypes = {
    fetchProjectsAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
  }
  state = {
    tab: 'projects',
  }
  componentDidMount() {
    const { fetchProjectsAction } = this.props;
    fetchProjectsAction();
  }
  handleTabSelect = (evt) => {
    // Save the input field
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
          </ul>
        </div>
        {this.state.tab === 'projects' &&
          <ListProject
            key="newProject"
            selectTab={this.handleTabSelect}
            loggedUser={this.props.loggedUser}
          />
        }
        {this.state.tab === 'create-team' &&
          <Team
            key="createTeam"
            projectid={this.state.projectid}
          />
        }
      </div>
    );
  }
}

export default Projects;
