import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import './listProject.css';
import Modal from '../Modal/modal';
import NewProject from '../../containers/NewProject/newProject';
import DetailProject from '../../containers/DetailProject/detailProject';
import Team from '../../containers/Team';

class ListProject extends React.Component {
  static propTypes = {
    projectListProcess: PropTypes.object.isRequired,
    activeProjectProcess: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    fetchSingleProjectAction: PropTypes.func.isRequired,
  }
  state = {
    showNewProjectForm: {
      display: false,
      zIndex: 0,
    },
    detailProjectModal: {
      display: false,
      zIndex: 0,
    },
    createTeamModal: {
      display: false,
      zIndex: 0,
    },
  }
  handleShowNewProjectForm = () => {
    this.setState(prevState => ({
      showNewProjectForm: {
        display: !prevState.showNewProjectForm.display,
        zIndex: 1,
      },
    }));
  }
  handleShowDetailModal = (evt) => {
    const { projectid } = evt.currentTarget.dataset;
    const { fetchSingleProjectAction } = this.props;
    fetchSingleProjectAction(projectid);
    this.setState(prevState => ({
      detailProjectModal: {
        display: true,
        zIndex: prevState.detailProjectModal.zIndex + 1,
      },
      createTeamModal: {
        display: false,
        zIndex: 0,
      },
      projectId: projectid,
    }));
  }
  handleShowCreateTeamModal = () => {
    this.setState(prevState => ({
      ...prevState,
      createTeamModal: {
        display: !prevState.createTeamModal.display,
        zIndex: prevState.createTeamModal.zIndex + 1,
      },
      detailProjectModal: {
        ...prevState.detailProjectModal,
        display: true,
      },
    }));
    // Avoid a nasty effect between transition
    setTimeout(() => {
      this.setState(prevState => ({
        ...prevState,
        detailProjectModal: {
          display: false,
          zIndex: 0,
        },
      }));
    }, 300);
  }
  handleCloseModal = (target) => {
    // This function is called form it self with his own evt
    // or from a child. Then the evt is directly the currentTarget
    let modalName;
    if (typeof target === 'string') {
      modalName = target;
    }
    else if (target.currentTarget) {
      modalName = target.currentTarget.name;
    }
    else {
      modalName = target.name;
    }
    // Wait until the transition is done
    setTimeout(() => {
      this.setState(() => ({
        [modalName]: {
          display: false,
          zIndex: 0,
        },
      }));
    }, 300);
  };
  render() {
    const { projectListProcess, loggedUser, activeProjectProcess } = this.props;
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
          {error && <span>{error}</span>}
          {projectListProcess.projects.map(project => (
            <ul
              className="project-list"
              key={project._id}
            >
              <li className="project-list-item">
                <h2>{project.title}</h2>
                <div className="content">
                  <p>Due Date: {project.dueDate && <Moment format="DD/MM/YYYY">{project.dueDate}</Moment>}</p>
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
        {this.state.showNewProjectForm.display &&
          <Modal
            name="showNewProjectForm"
            close={this.handleShowNewProjectForm}
            title="New Project"
            zIndex={this.state.showNewProjectForm.zIndex}
          >
            <NewProject
              loggedUser={this.props.loggedUser}
            />
          </Modal>}
        {this.state.createTeamModal.display &&
          <Modal
            name="createTeamModal"
            close={this.handleCloseModal}
            title="Create Team"
            zIndex={this.state.createTeamModal.zIndex}
          >
            <Team
              loggedUser={this.props.loggedUser}
            />
          </Modal>}
        {this.state.detailProjectModal.display && activeProjectProcess.loading === false ?
          <Modal
            name="detailProjectModal"
            close={this.handleCloseModal}
            title="Project"
            zIndex={this.state.detailProjectModal.zIndex}
          >
            <DetailProject
              loggedUser={this.props.loggedUser}
              openNewTeamModal={this.handleShowCreateTeamModal}
            />
          </Modal> : ''}
      </div>
    );
  }
}


export default ListProject;
