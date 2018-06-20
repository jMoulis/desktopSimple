import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '../../../../Modules/AlertBox';

class TeamProject extends React.Component {
  static propTypes = {
    activeTeam: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    closeFromParent: PropTypes.func.isRequired,
    editTeamAction: PropTypes.func.isRequired,
  }
  state = {
    alertBox: false,
  }
  handleDelete = () => {
    const { editTeamAction, projects, activeTeam, fetchSingleProjectAction } = this.props;
    const projectEdited = projects.find((project) => {
      if (project.teams) {
        return project.teams.find(projectTeam => projectTeam._id === activeTeam._id);
      }
      return null;
    });
    if (projectEdited) {
      fetchSingleProjectAction(projectEdited._id);
    }
    editTeamAction({
      project: {
        value: null,
        changed: true,
      },
    });
    this.setState(prevState => ({
      ...prevState,
      alertBox: !prevState.alertBox,
    }));
  }
  handleShowAlertBox = () => {
    this.setState(prevState => ({
      ...prevState,
      alertBox: !prevState.alertBox,
    }));
  }
  render() {
    const { activeTeam, globalActions, closeFromParent } = this.props;
    const { project } = activeTeam;
    if (!project) {
      return (
        <div className="team-project">
          <h1>No Project yet</h1>
          <p>To start you should to select a project</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              globalActions.startAppAction('Projects');
              closeFromParent();
            }}
          >Search Project
          </button>
        </div>
      );
    }
    return (
      <div className="team-project">
        <h1>{project.title}</h1>
        <button
          type="button"
          className="btn btn-danger"
          onClick={this.handleShowAlertBox}
        >
          Delete participation
        </button>
        {this.state.alertBox &&
          <AlertBox
            title="Deleting Your participation"
            message="WatchOut you are on your way to leave this project"
            buttons={[
              {
                type: 'danger',
                action: this.handleDelete,
                label: 'Yeap',
                category: 'danger',
              },
              {
                type: 'success',
                action: this.handleShowAlertBox,
                label: 'Nope',
                category: 'success',
              },
            ]}
            type="danger"
          />
        }
      </div>
    );
  }
}

export default TeamProject;
