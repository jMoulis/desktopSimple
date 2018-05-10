import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import './listProject.css';
import Modal from '../Modal/modal';
import NewProject from '../../containers/NewProject/newProject';
import DetailProject from '../../containers/DetailProject/detailProject';

class ListProject extends React.Component {
  static propTypes = {
    projectListProcess: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    fetchSingleProjectAction: PropTypes.func.isRequired,
    selectTab: PropTypes.func.isRequired,
  }
  state = {
    showNewProjectForm: false,
    detailProjectModal: false,
    projectId: null,
  }
  handleShowNewProjectForm = () => {
    this.setState(prevState => ({
      showNewProjectForm: !prevState.showNewProjectForm,
      detailProjectModal: false,
    }));
  }
  handleShowDetailModal = (evt) => {
    if (evt.target) {
      const btnName = evt.currentTarget.name;
      if (btnName) {
        return this.setState(() => ({
          [btnName]: false,
        }));
      }
    }
    const { projectid } = evt.currentTarget.dataset;
    const { fetchSingleProjectAction } = this.props;
    fetchSingleProjectAction(projectid);
    return this.setState(() => ({
      detailProjectModal: true,
      projectId: projectid,
    }));
  }
  render() {
    const { projectListProcess, loggedUser, selectTab } = this.props;
    const { error, loading } = projectListProcess;

    if (loading) {
      return <span>Loading</span>;
    }
    return (
      <div className="project-list-container">
        <div>
          {loggedUser.user.typeUser &&
          loggedUser.user.typeUser !== 'student' &&
          <ul className="project-list">
            <li className="project-list-item">
              <h2>Add a Project</h2>
              <div className="content add-project">
                <i
                  onKeyPress={this.handleShowNewProjectForm}
                  onClick={this.handleShowNewProjectForm}
                  className="fas fa-plus-circle fa-3x"
                />
              </div>
            </li>
          </ul>}
          {error && <span>{error.detail}</span>}
          {projectListProcess.projects.map(project => (
            <ul
              className="project-list"
              key={project._id}
            >
              <li className="project-list-item">
                <h2>{project.title}</h2>
                <div className="content">
                  <p>Due Date: <Moment format="DD/MM/YYYY">{project.dueDate}</Moment></p>
                  <p>Teams: {project.teams.length}</p>
                  <p>Description: {project.description}</p>
                  <ul className="tags-list">
                    {project.tags.map((tag, index) => <li key={index}>{tag}</li>)}
                  </ul>
                  <button
                    type="button"
                    data-projectid={project._id}
                    data-tab="project-detail"
                    onClick={this.handleShowDetailModal}
                  >
                    {/* if want to display in app parent use //clickTab */}
                    Check me out
                  </button>
                </div>
              </li>
            </ul>
          ))}
        </div>
        {this.state.showNewProjectForm &&
          <Modal
            name="showNewProjectForm"
            close={this.handleShowNewProjectForm}
            title="New Project"
          >
            <NewProject close={this.handleShowNewProjectForm} />
          </Modal>}
        {this.state.detailProjectModal &&
          <Modal
            name="detailProjectModal"
            close={this.handleShowDetailModal}
            title="Edit Project"
          >
            <DetailProject
              close={this.handleShowDetailModal}
              projectId={this.state.projectId}
              selectTab={selectTab}
            />
          </Modal>}
      </div>
    );
  }
}


export default ListProject;
