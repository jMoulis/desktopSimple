import React from 'react';
import PropTypes from 'prop-types';
import './project.css';
import ListProject from '../containers/Projects/ListProject';
import DetailProject from '../containers/Projects/DetailProject/detailProject';

class Projects extends React.Component {
  static propTypes = {
    fetchProjectsAction: PropTypes.func.isRequired,
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
                className="btn-form btn-app-toolbar unselectable"
                name="projects"
                data-tab="projects"
                onClick={this.handleTabSelect}
              >
              Projects
              </button>
            </li>
          </ul>
        </div>
        {this.state.tab === 'projects' && <ListProject key="newProject" clickTab={this.handleTabSelect} /> }
        {this.state.tab === 'project-detail' && <DetailProject key="detailProject" projectid={this.state.projectid} />}
      </div>
    );
  }
}

export default Projects;
