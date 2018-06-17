import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import './listProject.css';
import Modal from '../Modal/modal';
import NewProject from '../../containers/NewProject/newProject';
import DetailProject from '../../containers/DetailProject/detailProject';
import Team from '../../containers/Team';
import Loader from '../../../../../Modules/Loader';

class ListProject extends React.Component {
  static propTypes = {
    projectListProcess: PropTypes.object.isRequired,
    activeProjectProcess: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    globalProps: PropTypes.object.isRequired,
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
  handleCloseDetailModal = () => {
    this.setState(() => ({
      detailProjectModal: {
        display: false,
        zIndex: 0,
      },
    }));
  }
  handleCloseModal = (modalName) => {
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
    const {
      projectListProcess,
      loggedUser,
      activeProjectProcess,
      globalActions,
      globalProps,
    } = this.props;
    const { error, loading } = projectListProcess;
    if (loading) {
      return <Loader />;
    }
    if (loggedUser.typeUser && loggedUser.typeUser === 'student' && error) {
      return (
        <div className="notFound">
          <span>{error}</span>
        </div>
      );
    }
    return (
      <div className="project-list-container">
        <ul>
          <li>
            <form>
              <label>Criteria 1</label>
              <input />
              <label>Criteria 2</label>
              <input />
              <label>Criteria 3</label>
              <input />
              <label>Criteria 4</label>
              <input />
            </form>
          </li>
        </ul>
        <div>
          {loggedUser.typeUser &&
          loggedUser.typeUser !== 'student' &&
          <ul className="project-list">
            <li className="project-list-item">
              {!loggedUser.company ?
                <h2>Please fill in company's informations before posting a new project</h2> :
                <Fragment>
                  <h2>Add a Project</h2>
                  <div className="content add-project">
                    <i
                      onKeyPress={this.handleShowNewProjectForm}
                      onClick={this.handleShowNewProjectForm}
                      className="fas fa-plus-circle fa-3x"
                    />
                  </div>
                </Fragment>
              }
            </li>
          </ul>}
          {projectListProcess.projects.map(project => (
            <ul
              className="project-list"
              key={project._id}
            >
              <li
                className="project-list-item"
                data-projectid={project._id}
                data-tab="project-detail"
                onClick={this.handleShowDetailModal}
                onKeyPress={this.handleShowDetailModal}
              >
                <h2>{project.title}</h2>
                <div className="content">
                  <p>Due Date: {project.dueDate && <Moment format="DD/MM/YYYY">{project.dueDate}</Moment>}</p>
                  <p>Teams: {project.teams.length}</p>
                  <p>Description: {project.description}</p>
                  <ul className="tags-list">
                    {project.tags.map((tag, index) => <li key={index}>{tag}</li>)}
                  </ul>
                  <div>
                    <button
                      type="button"
                      data-projectid={project._id}
                      data-tab="project-detail"
                      onClick={this.handleShowDetailModal}
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        marginTop: '.5rem',
                      }}
                    >
                      Check me out
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          ))}
        </div>
        {this.state.showNewProjectForm.display &&
          <Modal
            name="showNewProjectForm"
            closeFromParent={this.handleShowNewProjectForm}
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
            closeFromParent={this.handleCloseModal}
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
            closeFromParent={this.handleCloseModal}
            title="Project"
            zIndex={this.state.detailProjectModal.zIndex}
          >
            <DetailProject
              loggedUser={this.props.loggedUser}
              openNewTeamModal={this.handleShowCreateTeamModal}
              globalActions={globalActions}
              globalProps={globalProps}
            />
          </Modal> : ''}
      </div>
    );
  }
}


export default ListProject;
