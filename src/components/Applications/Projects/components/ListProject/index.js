import React from 'react';
import PropTypes from 'prop-types';
import './listProject.css';
import Modal from '../Modal/modal';
import NewProject from '../../containers/Projects/NewProject/newProject';
import DetailProject from '../../containers/Projects/DetailProject/detailProject';

class ListProject extends React.Component {
  static propTypes = {
    projectListProcess: PropTypes.object.isRequired,
    fetchSingleProjectAction: PropTypes.func.isRequired,
  }
  state = {
    showNewProjectForm: false,
    detailProjectModal: false,
  }
  handleShowNewProjectForm = () => {
    this.setState(prevState => ({
      showNewProjectForm: !prevState.showNewProjectForm,
      detailProjectModal: false,
    }));
  }
  handleShowDetailModal = (evt) => {
    const { fetchSingleProjectAction } = this.props;
    if (evt.target) {
      const btnName = evt.target.name;
      if (btnName) {
        return this.setState(() => ({
          [btnName]: false,
        }));
      }
    }
    const { projectid } = evt.currentTarget.dataset;
    fetchSingleProjectAction(projectid);
    return this.setState(() => ({
      detailProjectModal: true,
    }));
  }
  render() {
    const { projectListProcess } = this.props;
    return (
      <div className="project-list-container">
        <div>
          <ul className="project-list">
            <li className="project-list-item">
              <h2>New Project</h2>
              <div className="content">
                <button type="button" onClick={this.handleModal}>New</button>
              </div>
            </li>
          </ul>
          {projectListProcess.projects.map(project => (
            <ul
              className="project-list"
              data-projectid={project._id}
              key={project._id}
              onKeyPress={this.handleShowDetailModal}
              onClick={this.handleShowDetailModal}
            >
              <li className="project-list-item">
                <h2>{project.title}</h2>
                <div className="content">
                  <p>Due Date: {project.dueDate}</p>
                  <p>Teams: {project.teams.length}</p>
                  <p>Description: {project.description}</p>
                  <ul className="tags-list">
                    {project.tags.map((tag, index) => <li key={index}>{tag}</li>)}
                  </ul>
                </div>
              </li>
            </ul>
          ))}
        </div>
        {this.state.showNewProjectForm && <Modal name="showNewProjectForm" close={this.handleShowNewProjectForm}><NewProject close={this.handleShowNewProjectForm} /></Modal>}
        {this.state.detailProjectModal && <Modal name="detailProjectModal" close={this.handleShowDetailModal}><DetailProject close={this.handleShowDetailModal} /></Modal>}
      </div>
    );
  }
}


export default ListProject;
