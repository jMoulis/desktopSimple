import React from 'react';
import PropTypes from 'prop-types';

import './listProject.css';
import Modal from '../../../../../Modules/Modal/modal';
import NewProject from '../../containers/NewProject/newProject';
import DetailProject from '../../containers/DetailProject/detailProject';
import Team from '../../containers/Team';
import Loader from '../../../../../Modules/Loader';
import ListProjectItem from './listProjectItem';

class ListProject extends React.Component {
  static propTypes = {
    projectListProcess: PropTypes.object.isRequired,
    activeProjectProcess: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    globalProps: PropTypes.object.isRequired,
    fetchSingleProjectAction: PropTypes.func.isRequired,
  };
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
  };
  handleShowNewProjectForm = () => {
    this.setState(prevState => ({
      showNewProjectForm: {
        display: !prevState.showNewProjectForm.display,
        zIndex: 1,
      },
    }));
  };
  handleShowDetailModal = evt => {
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
  };
  handleShowCreateTeamModal = () => {
    this.setState(prevState => ({
      ...prevState,
      createTeamModal: {
        display: !prevState.createTeamModal.display,
        zIndex: prevState.createTeamModal.zIndex + 20,
      },
      detailProjectModal: {
        ...prevState.detailProjectModal,
        display: true,
      },
    }));
  };
  handleCloseModalOnSuccess = modalName => {
    this.setState(prevState => ({
      [modalName]: {
        display: false,
        zIndex: 0,
      },
      detailProjectModal: {
        ...prevState.detailProjectModal,
        display: false,
      },
    }));
  };
  handleCloseModal = modalName => {
    this.setState(() => ({
      [modalName]: {
        display: false,
        zIndex: 0,
      },
    }));
  };
  render() {
    const {
      projectListProcess,
      activeProjectProcess,
      globalActions,
      globalProps,
    } = this.props;
    const { error, loading } = projectListProcess;
    if (loading) {
      return <Loader />;
    }
    if (
      globalProps.loggedUser.typeUser &&
      globalProps.loggedUser.typeUser === 'student' &&
      error
    ) {
      return (
        <div className="notFound">
          <span>{error.detail}</span>
        </div>
      );
    }
    return (
      <div className="project-list-container">
        <ul className="project-list">
          {projectListProcess.projects.map(project => (
            <ListProjectItem
              key={project._id}
              project={project}
              showDetailModal={this.handleShowDetailModal}
            />
          ))}
        </ul>
        {this.state.showNewProjectForm.display && (
          <Modal
            name="showNewProjectForm"
            closeFromParent={this.handleShowNewProjectForm}
            title="New Project"
            zIndex={this.state.showNewProjectForm.zIndex}
          >
            <NewProject />
          </Modal>
        )}
        {this.state.createTeamModal.display && (
          <Modal
            name="createTeamModal"
            closeFromParent={this.handleCloseModal}
            title="Create Team"
            zIndex={this.state.createTeamModal.zIndex}
          >
            <Team
              loggedUser={globalProps.loggedUser}
              closeOnSuccess={this.handleCloseModalOnSuccess}
            />
          </Modal>
        )}
        {this.state.detailProjectModal.display &&
        activeProjectProcess.loading === false ? (
          <Modal
            name="detailProjectModal"
            closeFromParent={this.handleCloseModal}
            title="Project"
            zIndex={this.state.detailProjectModal.zIndex}
          >
            <DetailProject
              openNewTeamModal={this.handleShowCreateTeamModal}
              globalActions={globalActions}
              globalProps={globalProps}
            />
          </Modal>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default ListProject;
